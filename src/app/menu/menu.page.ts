import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

// Services

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
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }
  
  salir () {
    this.navController.back ();
  }

  async cerrar_s () {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
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
