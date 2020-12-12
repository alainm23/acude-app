import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { elementAt, filter, finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  profesionales_salud: any [] = [];
  profesionales_salud_total: any [] = [];
  profesionales_salud_cargando: boolean = true;
  profesionales_ver_mas: boolean = true;

  tipos_centros_medicos: any [] = [];
  tipos_centros_medicos_cargando: boolean = true;
  ver_centros_medicos: boolean = false;

  publicidades: any [] = [];
  publicidad_cargando: boolean = true;

  ver_profesionales: boolean = false;
  ver_publicidad: boolean = false;

  departamentos: any [] = [];
  
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 2.5,
    spaceBetween: 20,
  };

  departamento: any;
  search_text: string = '';
  resultados_busqueda: any [] = [];

  selectOptions = {
    header: 'Seleccione un departamento'      
  };

  constructor (
    private api: ApiService,
    private loadingController: LoadingController,
    private navController: NavController,
    private storage: Storage,
    private alertController: AlertController
  ) {}

  async ngOnInit () {
    this.api.get_departamentos ().subscribe ((res: any) => {
      this.departamentos = res.departamentos;

      res.departamentos.forEach (async (departamento: any) => {
        let DEPARTAMENTO_SELECCIONADO = await this.storage.get ('DEPARTAMENTO_SELECCIONADO');
        console.log ('DEPARTAMENTO_SELECCIONADO', DEPARTAMENTO_SELECCIONADO);

        if (DEPARTAMENTO_SELECCIONADO === null) {
          if (departamento.id === this.api.USUARIO_DATA.departamento_id) {
            this.departamento = departamento;
          }
        } else {
          if (departamento.id === DEPARTAMENTO_SELECCIONADO) {
            this.departamento = departamento;
          }
        }
      });
      console.log (res);
    }, error => {
      console.log (error);
    });

    this.api.proximas_sin_pacientes ().subscribe (async (res: any) => {
      console.log (res);

      if (res.citas.length > 0) {
        this.completar_cita (res.citas [0]);
      } else if (res.citas.length > 1) {
        // let inputs: any [] = [];
        // res.citas.forEach ((cita: any) => {
        //   inputs.push ({
        //     name: 'radio1',
        //     type: 'radio',
        //     label: cita.centro_medico_sede_profesional.info_centro_medico_sucursal.denominacion,
        //     value: cita,
        //   })
        // });

        // const alert = await this.alertController.create({
        //   header: 'Citas incompletas',
        //   message: 'Seleccione ',
        //   inputs: inputs,
        //   buttons: [
        //     {
        //       text: 'Cancelar',
        //       role: 'cancel',
        //       cssClass: 'secondary',
        //       handler: () => {
        //         console.log('Confirm Cancel');
        //       }
        //     }, {
        //       text: 'Seleccionar',
        //       handler: (data: any) => {
        //         console.log (data);
        //         this.completar_cita (data);
        //       }
        //     }
        //   ]
        // });
    
        // await alert.present ();
      }
    }, error => {
      console.log (error);
    });
  }

  completar_cita (data: any) {
    let request: any = {
      doctor: {
        id: data.centro_medico_sede_profesional.info_doctor.id,
        nombre_completo: data.centro_medico_sede_profesional.info_doctor.nombre_completo,
        especialidad: '',
        brinda_telemedicina: data.centro_medico_sede_profesional.info_doctor.brinda_telemedicina,
        fotografia: data.centro_medico_sede_profesional.info_doctor.fotografia,
      },
      fecha: data.fecha,
      hora: data.hora,
      cita_id: data.id,
      monto: data.monto,
      direccion: data.centro_medico_sede_profesional.info_centro_medico_sucursal.direccion,
      tipo_cita: data.tipo_cita
    };

    console.log (request);
    this.navController.navigateForward (['datos-peruano-extrajero', JSON.stringify (request)]);
  }

  ver_mas_profesionales () {
    if (this.profesionales_ver_mas) {
      this.profesionales_salud = this.profesionales_salud_total;
    } else {
      this.profesionales_salud = [];
      let size = 0;
      this.profesionales_salud_total.forEach ((item: any) => {
        if (size < 4) {
          this.profesionales_salud.push (item);
        }
        size++
      });
    }
    
    this.profesionales_ver_mas = !this.profesionales_ver_mas;
  }

  search () {
    this.resultados_busqueda = [];

    if (this.search_text.trim () !== '') {
      this.api.buscar (this.search_text).subscribe ((res: any) => {
        console.log (res);
        this.resultados_busqueda = res.resultados;
      });
    }
  }

  get_profesionales (list: any []) {
    return list.filter ((e) => {
      return e.type === 'profesional_categoria' || e.type === 'especialidades' || e.type === 'profesionales';
    });
  }

  get_establ (list: any []) {
    return list.filter ((e) => {
      return e.type === 'centro_medico_tipos' || e.type === 'centros_medicos';
    });
  }

  get_publi (list: any []) {
    return list.filter ((e) => {
      return e.type === 'publicidades' || e.type === 'categorias_publicidad';
    });
  }

  ver_item_buscar (item: any) {
    console.log (item);
    if (item.type === 'profesional_categoria') {
      this.navController.navigateForward (['especialidad', item.searchable.id]);
    } else if (item.type === 'especialidades') {
      this.navController.navigateForward (['encuentra-profesional', item.searchable.id, item.searchable.nombre]);
    } else if (item.type === 'centro_medico_tipos') {
      this.navController.navigateForward (['mapa-establecimientos', item.searchable.id, item.searchable.nombre]);
    } else if (item.type === 'centros_medicos') {
      this.navController.navigateForward (['perfil-clinica', item.searchable.id]);
    } else if (item.type === 'publicidades') {
      this.navController.navigateForward (['publicidad-detalle', item.searchable.id, 0]);
    } else if (item.type === 'profesionales') {
      this.navController.navigateForward (['perfil-doctor', item.searchable.id]);
    }

    this.resultados_busqueda = [];
  }

  toggle_tipos_centros_medicos () {
    if (this.tipos_centros_medicos_cargando === true) {
      this.api.get_tipos_centros_medicos (this.departamento.id, 4).subscribe ((res: any) => {
        this.tipos_centros_medicos_cargando = false;

        console.log (res);
        this.tipos_centros_medicos = res.tipos_establecimientos;
      }, error => {
        this.tipos_centros_medicos_cargando = false;
        console.log (error);
      });
    }

    this.ver_centros_medicos = !this.ver_centros_medicos
  }

  toggle_publicidad () {
    this.publicidad_cargando = true;
    this.api.get_listado_publicidades (this.departamento.id, 6).subscribe ((res: any) => {
      console.log (res);

      this.publicidad_cargando = false;
      this.publicidades = res.publicidades;
    }, error => {
      console.log (error);
    });

    this.ver_publicidad = !this.ver_publicidad
  }
  ver_mas_establecimientos () {
    this.navController.navigateForward ('centros-medicos-lista');
  }

  toggle_profesionales () {
    if (this.profesionales_salud_cargando === true) {
      this.api.get_profesionales_salud ().subscribe ((res: any) => {
        console.log (res);

        this.profesionales_salud_cargando = false;
        this.profesionales_salud_total = res.tipos_profesionales;

        let size = 0;
        this.profesionales_salud_total.forEach ((item: any) => {
          if (size < 4) {
            this.profesionales_salud.push (item);
          }
          size++
        });
      }, error => {
        console.log (error);
      });
    }

    this.ver_profesionales = !this.ver_profesionales
  }

  filtrar_especialidades (item: any) {
    console.log (item);
    this.navController.navigateForward (['especialidad', item.id]);
  }

  busqueda_avanzada () {
    this.navController.navigateForward ('busqueda-avanzada');
  }

  historial () {
    this.navController.navigateForward ('historial-citas');
  }

  ver () {
    console.log ('Aquii');
  }

  menu () {
    this.navController.navigateForward ('menu');
  }

  ver_detalle_publicidad (item: any) {
    this.navController.navigateForward (['publicidad-detalle', item.id, item.id_categoria]);
  }

  ver_centros (item: any) {
    this.navController.navigateForward (['mapa-establecimientos', item.id, item.nombre]);
  }

  ver_todo_publicidad () {
    this.navController.navigateForward (['publicidad-lista']);
  }

  favoritos () {
    this.navController.navigateForward ('favoritos');
  }

  emergencia () {
    this.navController.navigateForward ('emergencia');
  }

  select_departamento () {
    this.storage.set ('DEPARTAMENTO_SELECCIONADO', this.departamento.id);
    this.storage.set ('DEPARTAMENTO_SELECCIONADO_DATA', JSON.stringify (this.departamento));

    this.publicidad_cargando = true;
    this.api.get_listado_publicidades (this.departamento.id, 6).subscribe ((res: any) => {
      this.publicidad_cargando = false;
      this.publicidades = res.publicidades;
    }, error => {
      console.log (error);
    });
  }
}
