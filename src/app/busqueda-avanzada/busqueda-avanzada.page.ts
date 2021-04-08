import { Component, OnInit, ɵConsole } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController, ToastController, LoadingController, NumericValueAccessor } from '@ionic/angular';

// Popovers
import { SelectEspecialidadPage } from '../popovers/select-especialidad/select-especialidad.page';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-busqueda-avanzada',
  templateUrl: './busqueda-avanzada.page.html',
  styleUrls: ['./busqueda-avanzada.page.scss'],
})
export class BusquedaAvanzadaPage implements OnInit {
  busco_un: string = 'profesionales';
  profesional_tipo_seleccionado: any = null;
  especialidad_seleccionada: any = null;
  exp: any = 'null';
  tarifa: any = 'null';

  idiomas: any [] = [];
  tarifas: any [] = [];

  profesionales_salud_total: any [] = [];
  atiende_domicilio: boolean = false;
  emergencias: boolean = false;
  telemedicina: boolean = false;
  constructor (private api: ApiService, 
    private popoverController: PopoverController,
    private storage: Storage,
    private navController: NavController,
    private loadingController: LoadingController,
    public toastController: ToastController,
    public loadingCtrl: LoadingController) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_profesionales_salud ().subscribe ((res: any) => {
      console.log (res);
      this.profesionales_salud_total = res.tipos_profesionales;

      this.api.get_listado_tarifas ().subscribe ((res: any) => {
        console.log (res);
        loading.dismiss ();
        this.tarifas = res.tarifas;
      }, error => {
        console.log (error);
        loading.dismiss ();
      });
    }, error => {
      loading.dismiss ();
      console.log (error);
    });

    this.api.get_idiomas ().subscribe ((res: any) => {
      console.log (res.idiomas);

      Object.entries(res.idiomas).forEach ((val: any) => {
        this.idiomas.push ({
          id: val [0],
          nombre: val [1],
          checked: false
        })
      });
    });
  }

  async open_especialidad_popover (e: any) {
    console.log ()

    if (this.profesional_tipo_seleccionado === null) {
      const toast = await this.toastController.create({
        message: 'Seleccione una tipo de profesional',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      
      toast.present();
    } else {
      const popover = await this.popoverController.create({
        component: SelectEspecialidadPage,
        showBackdrop: true,
        componentProps: {
          id: this.profesional_tipo_seleccionado.id
        },
        event: e
      });
  
      popover.onDidDismiss ().then ((response: any) => {
        if (response.role === 'ok') {
          console.log (response.data);
          this.especialidad_seleccionada = response.data;
  
          console.log (this.especialidad_seleccionada);
        } else if (response.role === 'clear') {
          this.especialidad_seleccionada = null;
        }
      });
  
      return await popover.present ();
    }
  }

  async submit () {
    const loading = await this.loadingController.create ({
      message: 'Procesando...',
    });

    loading.present ();

    let DEPARTAMENTO_SELECCIONADO = await this.storage.get ('DEPARTAMENTO_SELECCIONADO');
    if (DEPARTAMENTO_SELECCIONADO === null) {
      DEPARTAMENTO_SELECCIONADO = this.api.USUARIO_DATA.departamento_id;
    }

    let idespecialidad = null;
    if (this.especialidad_seleccionada !== null) {
      idespecialidad = this.especialidad_seleccionada.id;
    }

    let experiencia_min = null;
    let experiencia_max = null;
    if (this.exp === 'null') {
      experiencia_max = null;
      experiencia_min = null;
    } else {
      experiencia_min = parseInt (this.exp.split ("-") [0]);
      experiencia_max = parseInt (this.exp.split ("-") [1]);
    }

    let idioma = this.idiomas.filter ((element: any) => {
      return element.checked;
    }).map ((element: any) => {
      return element.id
    }).join (',');

    if (idioma === '') {
      idioma = null;
    }

    let honorario_minimo = null;
    let honorario_maximo = null;
    if (this.tarifa === 'null') {
      honorario_minimo = null;
      honorario_maximo = null;
    } else {
      honorario_minimo = parseInt (this.tarifa.split ("-") [0]);
      honorario_maximo = parseInt (this.tarifa.split ("-") [1]);
    }

    let atiende_domicilio: number = null;
    var emergencias: number = null;
    var telemedicina: number = null;

    if (this.atiende_domicilio) {
      atiende_domicilio = 1;
    }

    if (this.emergencias) {
      emergencias = 1;
    }

    if (this.telemedicina) {
      telemedicina = 1;
    }

    // tipo_profesional: string,
    // departamento: number,
    // idespecialidad: string=null,
    // experiencia_min: number=null,
    // experiencia_max:number=null,
    // idiomas: string=null,
    // honorario_minimo: number=null,
    // honorario_maximo: number=null,
    // atiende_domicilio: number=null,
    // emergencias: number=null,
    // telemedicina: number=null

    this.api.buscar_profesional_avanzado (
      this.profesional_tipo_seleccionado.id,
      DEPARTAMENTO_SELECCIONADO,
      idespecialidad,
      experiencia_min,
      experiencia_max,
      idioma,
      honorario_minimo,
      honorario_maximo,
      atiende_domicilio,
      emergencias,
      telemedicina).subscribe (async (res: any) => {
      loading.dismiss ();
      console.log (res);

      if (res.profesionales.length > 0) {
        this.navController.navigateForward (['busqueda-avanzada-respuesta', JSON.stringify (res.profesionales)]);
      } else {
        const toast = await this.toastController.create({
          message: 'No se encuentra ningun resultados',
          duration: 2000,
          position: 'top'
        });

        toast.present();
      }
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  back () {
    this.navController.back ();
  }
}
