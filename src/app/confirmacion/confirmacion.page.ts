import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {
  data: any;
  datetime: any;
  constructor (private route: ActivatedRoute, private navController: NavController) { }

  ngOnInit () {
    this.data = JSON.parse (this.route.snapshot.paramMap.get ('data'));
    console.log (this.data);

    this.datetime = moment (this.data.fecha).set ('hour', parseInt (this.data.hora.split (':') [0])).set ('minute', parseInt (this.data.hora.split (':') [1]));
  }

  get_date_format (format: string) {
    return this.datetime.format (format);
  }

  get_relative_date () {
    if (this.datetime.isSame (moment (), 'day')) {
      return 'Hoy';
    } else if (this.datetime.isSame (moment().add (1, 'days'), 'day')) {
      return 'Mañana';
    }

    let day: string = this.datetime.format ('dddd');
    return day.charAt(0).toUpperCase () + day.slice (1);
  }

  get_date () {
    let month: string = this.datetime.format ('MMM');
    return this.datetime.format ('DD[ ]') + month.charAt(0).toUpperCase () + month.slice (1);
  }
  
  get_tipo_cita (get_tipo_cita: string) {
    if (get_tipo_cita === '0') {
      return 'Presencal';
    }

    return 'Virtual';
  }

  ver_historial () {
    this.navController.navigateRoot ('historial-citas');
  }
}
