import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-cita-resultados',
  templateUrl: './cita-resultados.page.html',
  styleUrls: ['./cita-resultados.page.scss'],
})
export class CitaResultadosPage implements OnInit {
  id: any;
  data: any;
  datetime: any;
  constructor (
    private route: ActivatedRoute,
    private navController: NavController,
    private socialSharing: SocialSharing,
    private api: ApiService,
    private loadingCtrl: LoadingController
    ) { }

  async ngOnInit () {
    this.id = JSON.parse (this.route.snapshot.paramMap.get ('id'));
    console.log (this.id);

    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.informacion_cita (this.id).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();
      this.data = res.cita [0];
    }, error => {
      console.log (error);
      loading.dismiss ();
    });
    // if (this.data !== null && this.data !== undefined) {
    //   this.datetime = moment (this.data.fecha).set ('hour', parseInt (this.data.hora.split (':') [0])).set ('minute', parseInt (this.data.hora.split (':') [1]));
    // }
  }

  get_date_format (format: string) {
    // return this.datetime.format (format);
    return '';
  }

  get_relative_date () {
    // if (this.datetime.isSame (moment (), 'day')) {
    //   return 'Hoy';
    // } else if (this.datetime.isSame (moment().add (1, 'days'), 'day')) {
    //   return 'Mañana';
    // }

    // let day: string = this.datetime.format ('dddd');
    // return day.charAt(0).toUpperCase () + day.slice (1);

    return '';
  }

  get_date () {
    // if (this.datetime !== undefined && this.datetime !== null) {
    //   return '';
    // }

    // let month: string = this.datetime.format ('MMM');
    // return this.datetime.format ('DD[ ]') + month.charAt(0).toUpperCase () + month.slice (1);

    return '';
  }
  
  get_tipo_cita (get_tipo_cita: string) {
    // if (get_tipo_cita === '0') {
    //   return 'Presencal';
    // }

    // return 'Virtual';

    return '';
  }

  ver_historial () {
    // this.navController.navigateRoot (['historial-citas', 'false']);
  }

  back () {
    this.navController.back ();
  }

  compartir_enlace () {
    this.socialSharing.share ('');
  }
}
