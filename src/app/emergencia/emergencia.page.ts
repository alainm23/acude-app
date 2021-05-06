import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController } from '@ionic/angular';
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
  emergencia_principal: any;
  constructor (
    private navController: NavController,
    private api: ApiService, 
    private callNumber: CallNumber,
    private loadingCtrl: LoadingController, 
    private storage: Storage) { }

  async ngOnInit () {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    let DEPARTAMENTO_SELECCIONADO = await this.storage.get ('DEPARTAMENTO_SELECCIONADO');
    console.log ('DEPARTAMENTO_SELECCIONADO', DEPARTAMENTO_SELECCIONADO);

    if (DEPARTAMENTO_SELECCIONADO === null) {
      DEPARTAMENTO_SELECCIONADO === this.api.USUARIO_DATA.departamento_id
    }

    this.api.get_numero_emergencia (DEPARTAMENTO_SELECCIONADO).subscribe ((res: any) => {
      console.log (res);
      this.emergencias = res.emergencias;
      loading.dismiss ();
    });

    this.api.get_obtener_info_emergencia ().subscribe ((res: any) => {
      console.log (res);
      this.emergencia_principal = res.emergencias;
    }, error => {
      console.log (error);
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

  get_foto (fotografia: any) {
    if (fotografia === null || fotografia === undefined) {
      return '';
    }

    return 'https://www.acudeapp.com/storage/' + fotografia;
  }
}
