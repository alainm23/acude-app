import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor (
    private navController: NavController,
    private alertController: AlertController,
    private api: ApiService,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }
  
  salir () {
    this.navController.back ();
  }

  go_page (page: string) {
    this.navController.navigateForward (page)
  }

  contactar () {
    this.socialSharing.shareViaEmail ('', '', ['soporte@acudeapp.com']).then (() => {
      // Success!
    }).catch ((error: any) => {
      console.log (error);
    });
  }

  share_app () {
    this.socialSharing.share ('Te recomiendo usar la siguiente app https://www.acudeapp.com/').then (() => {

    }).catch ((error: any) => {
      console.log (error);
    });
  }

  favoritos () {
    this.navController.navigateForward ('favoritos');
  }

  go_historial () {
    this.navController.navigateForward ('historial-citas');
  }

  ser_pro () {
    window.open ('https://www.acudeapp.com/formulario', '_system');
  }

  async cerrar_s () {
    const alert = await this.alertController.create({
      header: 'Confirma operación',
      message: '¿Está seguro que desea salir de ACUDE APP?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Procesando...',
            });
        
            await loading.present ();

            this.api.logout ().subscribe ((res: any) => {
              loading.dismiss ();
              
              console.log (res);

              this.storage.set ('USUARIO_ACCESS', null);
              this.storage.set ('USUARIO_DATA', null);
              this.storage.set ('DEPARTAMENTO_SELECCIONADO', null);
              
              this.navController.navigateRoot ('login');
            }, (error: any) => {
              console.log (error);
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
