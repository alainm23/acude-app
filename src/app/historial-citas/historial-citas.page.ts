import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

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
  constructor (
    private api: ApiService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private navController: NavController) { }

  async ngOnInit () {
    
  }

  async ionViewDidEnter () {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.relacionados_pacientes ().subscribe ((res: any) => {
      this.api.historial_citas ().subscribe ((res: any) => {
        loading.dismiss ();
        console.log (res);
        this.citas = res.citas;
        this._citas = res.citas;
        this.segmentChanged (null);

        if (this.route.snapshot.paramMap.get ('mostrar_alerta') === 'true') {
          this.ver_cita (null);
        }    
      }, error => {
        loading.dismiss ();
        console.log (error);
      });

      this.pacientes = res.pacientes;
    }, error => {
      loading.dismiss ();
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
      return 'Presencial';
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
        return item.estado === '0';
      });
    } else {
      this.citas = this.citas.filter ((item: any) => {
        return item.estado === '1';
      });
    }
  }

  editar (item: any) {
    let data: any = {
      cita_id: item.id,
      centro_medico_id: item.id_centro_medico_profesional,
      direccion: item.centro_medico_sede_profesional.info_centro_medico_sucursal.direccion,
      precio: item.centro_medico_sede_profesional.precio_consulta,
      editar: true
    };
    
    this.navController.navigateForward (
      ['escoje-fecha-hora', JSON.stringify ({
        id: item.centro_medico_sede_profesional.info_doctor.id,
        nombre_completo: item.centro_medico_sede_profesional.info_doctor.nombre_completo,
        especialidad: '',
        brinda_telemedicina: item.centro_medico_sede_profesional.info_doctor.brinda_telemedicina,
        fotografia: item.centro_medico_sede_profesional.info_doctor.fotografia,
      }), JSON.stringify (data)]
    );
  }

  back () {
    this.navController.navigateRoot ('home');
  }

  async ver_cita (item: any) {
    console.log (item);

    if (this.tipo_citas === 'proximas') {
      if (item.tipo_cita === "1") {
        this.navController.navigateForward (['cita-detalle', JSON.stringify ({
          nombre_paciente: item.paciente.nombres + ' ' + item.paciente.apellidos,
          doctor_nombre: item.centro_medico_sede_profesional.info_doctor.nombre_completo,
          fecha: item.fecha,
          hora: item.hora,
          tipo_cita: item.tipo_cita,
          enlace_sala: item.enlace_sala
        })]);
      }
    } else {
      this.navController.navigateForward (['cita-resultados', item.id]);
    }
  }

  get_format_date (date: any) {
    if (date === undefined || date === null) {
      return '';
    }

    return moment (date).format ('L');
  }
}
