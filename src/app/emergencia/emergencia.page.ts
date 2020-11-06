import { Component, OnInit } from '@angular/core';

// Services
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';

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
    private callNumber: CallNumber, 
    private storage: Storage) { }

  async ngOnInit () {
    let DEPARTAMENTO_SELECCIONADO = await this.storage.get ('DEPARTAMENTO_SELECCIONADO');
    console.log ('DEPARTAMENTO_SELECCIONADO', DEPARTAMENTO_SELECCIONADO);

    if (DEPARTAMENTO_SELECCIONADO === null) {
      DEPARTAMENTO_SELECCIONADO === this.api.USUARIO_DATA.departamento_id
    }

    this.api.get_numero_emergencia (DEPARTAMENTO_SELECCIONADO).subscribe ((res: any) => {
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
