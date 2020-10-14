import { Component, OnInit } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { LoadingController, NavController } from '@ionic/angular';

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

  departamento_id: number = 16;
  constructor (
    private api: ApiService,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  compareWith (e1: any, e2: any): boolean {
    return e1 === e2;
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

  toggle_tipos_centros_medicos () {
    if (this.profesionales_salud_cargando === true) {
      this.api.get_tipos_centros_medicos ('tipos-centros-medicos-menu-principal').subscribe ((res: any) => {
        this.tipos_centros_medicos_cargando = false;

        Object.entries(res.tipos_centros_medicos).forEach ((val: any) => {
          this.tipos_centros_medicos.push ({
            id: val [0],
            nombre: val [1]
          })
        });
      }, error => {
        this.tipos_centros_medicos_cargando = false;
        console.log (error);
      });
    }

    this.ver_centros_medicos = !this.ver_centros_medicos
  }

  toggle_profesionales () {
    if (this.profesionales_salud_cargando === true) {
      this.api.get_profesionales_salud ().subscribe ((res: any) => {
        console.log (res);

        this.profesionales_salud_cargando = false;

        Object.entries (res.profesionales).forEach ((val: any) => {
          this.profesionales_salud_total.push ({
            id: val [0],
            nombre: val [1]
          })
        });

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

  async ngOnInit () {
    this.api.get_departamentos ().subscribe ((res: any) => {
      Object.entries (res.departamentos).forEach ((val: any) => {
        this.departamentos.push ({
          id: parseInt (val [0]),
          nombre: val [1]
        });
      });

      console.log (this.departamentos);
    }, error => {
      console.log (error);
    });

    this.api.get_listado_publicidades ().subscribe ((res: any) => {
      this.publicidades = res.publicidades;
    });
  }

  filtrar_especialidades (item: any) {
    console.log (item);
    this.navController.navigateForward (['especialidad', item.id]);
  }

  busqueda_avanzada () {
    console.log ('Click aqui');
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
}
