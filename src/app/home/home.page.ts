import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { LoadingController, NavController } from '@ionic/angular';
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
  constructor (
    private api: ApiService,
    private loadingController: LoadingController,
    private navController: NavController,
    private storage: Storage
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

    // Dinamico
    this.api.get_listado_publicidades (16, 6).subscribe ((res: any) => {
    // this.api.get_listado_publicidades (this.departamento.id, 6).subscribe ((res: any) => {
      this.publicidades = res.publicidades;

      console.log (res);
    });
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

    this.api.buscar (this.search_text).subscribe ((res: any) => {
      console.log (res);
      this.resultados_busqueda = res.resultados;
    });
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
    if (this.profesionales_salud_cargando === true) {
      this.api.get_tipos_centros_medicos (this.departamento.id, 4).subscribe ((res: any) => {
        this.tipos_centros_medicos_cargando = false;

        console.log (res);
        this.tipos_centros_medicos = res.tipos_establecimientos;
        // Object.entries(res.tipos_centros_medicos).forEach ((val: any) => {
        //   this.tipos_centros_medicos.push ({
        //     id: val [0],
        //     nombre: val [1]
        //   })
        // });
      }, error => {
        this.tipos_centros_medicos_cargando = false;
        console.log (error);
      });
    }

    this.ver_centros_medicos = !this.ver_centros_medicos
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
  }
}
