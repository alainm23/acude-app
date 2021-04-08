import { Component } from '@angular/core';

import { Platform, LoadingController, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as moment from 'moment';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { OneSignal, OSNotificationOpenedResult, OSNotification } from '@ionic-native/onesignal/ngx';
import { ApiService } from '../app/services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    private loadingController: LoadingController,
    private navController: NavController,
    private oneSignal: OneSignal,
    private api: ApiService,
    private storage: Storage,
    public toastController: ToastController
  ) {
    this.initializeApp ();
  }

  async initializeApp () {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      moment.locale ('es');

      if (this.platform.is('android')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#000000');
      }
      
      this.deeplinks.route({ '/': {}, '/web': { 'web': true }}).subscribe (async (match: any) => {
        const type: string = match.$args.type;
        const id: string = match.$args.id;

        const loading = await this.loadingController.create({
          message: 'Procesando Informacion ...'
        });

        if (type === 'doctor') {
          this.navController.navigateForward (['perfil-clinica', id, -1]);
        } else if (type === 'centro-medico') {
          this.navController.navigateForward (['perfil-clinica', id, -1]);
        }
      }, nomatch => {
        console.error('Got a deeplink that didn\'t match', nomatch);
      });

      this.init_onesignal (JSON.parse (await this.storage.get ('USUARIO_DATA')));
      this.api.get_usuario_observable ().subscribe ((usuario: any) => {
        console.log ('get_usuario_observable', usuario);
        this.init_onesignal (usuario);
      });
    });
  }

  init_onesignal (usuario: any) {
    if (this.platform.is ('cordova') && usuario !== null && usuario !== undefined) {
      this.oneSignal.startInit('27530a62-11a9-45a0-af08-67270b071403', '1093373311030');
      this.oneSignal.inFocusDisplaying (this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationOpened ().subscribe (async (jsonData: OSNotificationOpenedResult) => {
        const tipo_cita = jsonData.notification.payload.additionalData.tipo_cita;
        if (tipo_cita === '1') {
          this.navController.navigateForward (['historial-citas', 'true']);
        }
      });

      this.oneSignal.handleNotificationReceived ().subscribe (async (jsonData: OSNotification) => {
        const tipo_cita = jsonData.payload.additionalData.tipo_cita;
        const toast = await this.toastController.create ({
          header: 'Recordatorio de cita medica',
          position: 'top',
          color: 'light',
          mode: 'ios',
          duration: 3500,
          buttons: [
            {
              side: 'end',
              text: 'Ver',
              handler: () => {
                if (tipo_cita === '1') {
                  this.navController.navigateForward (['historial-citas', 'true']);
                }
              }
            }
          ]
        });
    
        toast.present ();
      });

      this.oneSignal.endInit ();
      
      this.oneSignal.getIds ().then ((oS: any) => {
        
      });

      this.oneSignal.getTags ().then ((data: any) => {
        
      });

      this.oneSignal.sendTag ('Usuario', 'true');
      this.oneSignal.sendTag (usuario.id, 'true');
    }
  }
}
