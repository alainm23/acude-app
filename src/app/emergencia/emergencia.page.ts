import { Component, OnInit } from '@angular/core';

// Services
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-emergencia',
  templateUrl: './emergencia.page.html',
  styleUrls: ['./emergencia.page.scss'],
})
export class EmergenciaPage implements OnInit {
  emergencias: any;
  constructor (
    private navController: NavController,
    private api: ApiService, 
    private callNumber: CallNumber) { }

  ngOnInit () {
    this.api.get_numero_emergencia ().subscribe ((res: any) => {
      console.log (res);
      this.emergencias = res.emergencias;
    });
  }

  llamar (number: string) {
    this.callNumber.callNumber (number, true)
    .then (res => console.log ('Launched dialer!', res))
    .catch (err => console.log ('Error launching dialer', err));
  }

  close () {
    this.navController.back ();
  }
}
