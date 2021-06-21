import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-comentarios-lista',
  templateUrl: './comentarios-lista.page.html',
  styleUrls: ['./comentarios-lista.page.scss'],
})
export class ComentariosListaPage implements OnInit {
  items: any [] = [];
  constructor (private route: ActivatedRoute, 
    private alertController: AlertController, 
    private api: ApiService,
    private navController: NavController,
    private loadingCtrl: LoadingController,
    private storage: Storage) { }

  async ngOnInit () {
    
  }

  async ionViewWillEnter () {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.listado_de_citas_sin_calificacion ().subscribe (async (res: any) => {
      console.log (res);
      this.items = res.citas;
      loading.dismiss ();
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  calificar (item: any) {
    this.navController.navigateForward (['califica-atencion', JSON.stringify (item), this.items.length]);
  }

  async back () {
    // this.storage.set ('calificar', true).then (() => {
      this.navController.back ();
    // });
  }

  get_imagen (fotografia: string) {
    if (fotografia === null || fotografia === undefined) {
      return 'assets/img/ion-avatar.png';
    }

    return 'https://www.acudeapp.com/storage/' + fotografia;
  }
}
