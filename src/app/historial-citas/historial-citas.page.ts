import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-historial-citas',
  templateUrl: './historial-citas.page.html',
  styleUrls: ['./historial-citas.page.scss'],
})
export class HistorialCitasPage implements OnInit {
  pacientes: any [] = [];
  citas: any [] = [];
  _citas: any[] = [];
  tipo_citas: string = 'proximas';
  paciente_seleccionado: string = 'todos';
  constructor (private api: ApiService, private loadingCtrl: LoadingController, private navController: NavController) { }

  async ngOnInit () {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.relacionados_pacientes ().subscribe ((res: any) => {
      loading.dismiss ();
      console.log (res);
      this.pacientes = res.pacientes;
    }, error => {
      loading.dismiss ();
    });

    this.api.historial_citas ().subscribe ((res: any) => {
      loading.dismiss ();
      console.log (res);
      this.citas = res.citas;
      this._citas = res.citas;
      this.segmentChanged (null);
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  async changed (event: any) {
    this.citas = this._citas;

    if (event !== 'todos') {
      this.citas = this.citas.filter ((item: any) => {
        return item.id_paciente === event.id;
      });
    }
  }

  get_tipo_cita (get_tipo_cita: string) {
    if (get_tipo_cita === '0') {
      return 'Presencal';
    }

    return 'Virtual';
  }

  validar_boton (item: any) {
    let returned: boolean = true;

    let data = moment (item.fecha + ' ' + item.hora);
    let now = moment ();

    var duration = moment.duration (data.diff (now));
    var hours = duration.asHours();
    
    if (hours < 24 || item.reprogramar_cita === '1') {
      returned = false;
    }

    return returned;
  }

  segmentChanged (event: any) {
    this.citas = this._citas;

    if (this.tipo_citas === 'proximas') {
      this.citas = this.citas.filter ((item: any) => {
        let today = moment ();
        let data = moment (item.fecha + ' ' + item.hora);

        console.log (data);
        console.log (data.diff (today));

        return data.diff (today) > 0;
      });
    } else {
      this.citas = this.citas.filter ((item: any) => {
        let today = moment ();
        let data = moment (item.fecha + ' ' + item.hora);

        console.log (data);
        console.log (data.diff (today));

        return data.diff (today) < 0;
      });
    }
  }

  editar (item: any) {
    console.log (item);

    let data: any = {
      cita_id: item.id,
      centro_medico_id: item.id_centro_medico_profesional,
      direccion: item.centro_medico_sede_profesional.info_centro_medico_sucursal.direccion,
      precio: item.centro_medico_sede_profesional.precio_consulta,
      editar: true
    };
    
    this.navController.navigateForward (
      ['escoje-fecha-hora', JSON.stringify ({
        nombre_completo: item.centro_medico_sede_profesional.info_doctor.nombre_completo,
        especialidad: '',
        brinda_telemedicina: item.centro_medico_sede_profesional.info_doctor.brinda_telemedicina,
        fotografia: item.centro_medico_sede_profesional.info_doctor.fotografia,
      }), JSON.stringify (data)]
    );
  }
}
