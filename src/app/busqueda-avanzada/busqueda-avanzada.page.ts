import { Component, OnInit, ɵConsole } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';

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
  idiomas: any [] = [];

  profesionales_salud_total: any [] = [];
  constructor (private api: ApiService, 
    private popoverController: PopoverController,
    private storage: Storage,
    private navController: NavController,
    private loadingController: LoadingController,
    public toastController: ToastController) { }

  ngOnInit() {
    this.api.get_profesionales_salud ().subscribe ((res: any) => {
      console.log (res);
      this.profesionales_salud_total = res.tipos_profesionales;
    }, error => {
      console.log (error);
    });

    this.api.get_idiomas ().subscribe ((res: any) => {
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

    console.log (this.exp);
    console.log (experiencia_min);
    console.log (experiencia_max);

    this.api.buscar_profesional_avanzado (
      this.profesional_tipo_seleccionado.id,
      DEPARTAMENTO_SELECCIONADO,
      idespecialidad,
      experiencia_min,
      experiencia_max).subscribe (async (res: any) => {
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
