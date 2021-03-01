import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-cita-detalle',
  templateUrl: './cita-detalle.page.html',
  styleUrls: ['./cita-detalle.page.scss'],
})
export class CitaDetallePage implements OnInit {
  data: any;
  datetime: any;
  constructor (
    private route: ActivatedRoute,
    private navController: NavController,
    private socialSharing: SocialSharing,
    private loadingController: LoadingController
    ) { }

  ngOnInit () {
    this.data = JSON.parse (this.route.snapshot.paramMap.get ('id'));
    console.log (this.data);

    if (this.data !== null && this.data !== undefined) {
      this.datetime = moment (this.data.fecha + ' ' + this.data.hora);
    }
  }

  get_date_format (format: string) {
    // return this.datetime.format (format);
    return '';
  }

  get_relative_date () {
    if (this.datetime.isSame (moment (), 'day')) {
      return 'Hoy';
    } else if (this.datetime.isSame (moment().add (1, 'days'), 'day')) {
      return 'Mañana';
    }

    let day: string = this.datetime.format ('dddd');
    return day.charAt(0).toUpperCase () + day.slice (1);

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
    if (get_tipo_cita === '0') {
      return 'Presencal';
    }

    return 'Virtual';

    return '';
  }

  ver_historial () {
    // this.navController.navigateRoot (['historial-citas', 'false']);
  }

  back () {
    this.navController.back ();
  }

  async share () {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    const text = `
      Su codigo de acceso es:
      - ${this.data.enlace_sala}
      ACUDE Consultorio Virtual:
      - http://play.google.com/store/apps/details?id=web.acude.live
      Desde PC:
      - https://pacientes.acudeapp.com
    `;

    console.log (text);

    this.socialSharing.share (text).then (() => {
      loading.dismiss ();
    }).catch ((error: any) => {
      loading.dismiss ();
    });
  }
}
