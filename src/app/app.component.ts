import { Component } from '@angular/core';

import { Platform, LoadingController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as moment from 'moment';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

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
    private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
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
          this.navController.navigateForward (['perfil-clinica', id]);
        } else if (type === 'centro-medico') {
          this.navController.navigateForward (['perfil-clinica', id]);
        }
      }, nomatch => {
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
    });
  }
}
