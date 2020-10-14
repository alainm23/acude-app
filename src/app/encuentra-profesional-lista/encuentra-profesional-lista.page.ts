import { Component, OnInit } from '@angular/core';

// Services
import { LoadingController, PopoverController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

// Popovers
import { SelectIdiomaPage } from '../popovers/select-idioma/select-idioma.page';
import { SelectHonorarioPage } from '../popovers/select-honorario/select-honorario.page';
import { SelectHorarioPage } from '../popovers/select-horario/select-horario.page';
import * as moment from 'moment';

@Component({
  selector: 'app-encuentra-profesional-lista',
  templateUrl: './encuentra-profesional-lista.page.html',
  styleUrls: ['./encuentra-profesional-lista.page.scss'],
})
export class EncuentraProfesionalListaPage implements OnInit {
  profesionales: any [] = [];
  _profesionales: any [] = [];
  idiomas: any [] = [];
  nombre: string = '';
  
  precio_maximo: number = 0;
  precio_minimo: number = 0;
  min: number = 0;
  max: number = 0;
  hora_filtro: string = '';
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 10,
  };
  constructor (
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private navController: NavController,
    private api: ApiService,
    private route: ActivatedRoute) {}

  async ngOnInit() {
    this.nombre = this.route.snapshot.paramMap.get ('nombre');
    console.log ('string_consultorios', this.route.snapshot.paramMap.get ('string_consultorios'));
    console.log ('string_cm', this.route.snapshot.paramMap.get ('string_cm'));

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();
    
    
    this.api.obtener_informacion_profesionales_lista  (
      this.route.snapshot.paramMap.get ('string_consultorios'),
      this.route.snapshot.paramMap.get ('string_cm')).subscribe ((res: any) => {
      console.log (res);
      this.precio_minimo = res.precio_minimo;
      this.precio_maximo = res.precio_maximo;
      this.min = res.verificar_precio;
      this.max = res.precio_maximo

      loading.dismiss ();

      this.profesionales = res.profesionales;
      this._profesionales = res.profesionales;
    }, (error) => {
      console.log('Error getting location', error);
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

  back () {
    this.navController.back ();
  }

  async open_idioma_popover (e: any) {
    const popover = await this.popoverController.create({
      component: SelectIdiomaPage,
      showBackdrop: true,
      componentProps: {
        items: this.idiomas
      },
      event: e
    });

    popover.onDidDismiss ().then ((response: any) => {
      if (response.role === 'ok') {
        console.log (response);
        this.idiomas = response.data;
        
        this.profesionales = this._profesionales;
        this.profesionales = this.profesionales.filter ((item: any) => {
          return this.verificar_idioma (item.listaidiomas)
        });
      }
    });

    return await popover.present ();
  }

  async open_honorario_popover (e: any) {
    const popover = await this.popoverController.create({
      component: SelectHonorarioPage,
      componentProps: {
        min: this.precio_minimo,
        max: this.precio_maximo
      },
      showBackdrop: true,
      event: e
    });

    popover.onDidDismiss ().then ((response: any) => {
      if (response.role === 'ok') {
        console.log (response);
        this.min = response.data.min;
        this.max = response.data.max;
        
        this.profesionales = this._profesionales;
        this.profesionales = this.profesionales.filter ((item: any) => {
          return this.verificar_precio (item)
        });
      }
    });

    return await popover.present ();
  }

  async open_horario_popover (e: any) {
    const popover = await this.popoverController.create({
      component: SelectHorarioPage,
      showBackdrop: true,
      event: e
    });

    popover.onDidDismiss ().then ((response: any) => {
      if (response.role === 'ok') {        
        this.profesionales = this._profesionales;
        this.profesionales = this.profesionales.filter ((item: any) => {
          return this.verificar_horario (item, response.data);
        });
      }
    });

    return await popover.present ();
  }

  get_tiempo_experiencia (date: string) {
    var fecha1 = moment ();
    var fecha2 = moment (date);

    if (fecha1.diff (fecha2, 'years') > 0) {
      return fecha1.diff (fecha2, 'years') + ' año(s)'
    } else if (fecha1.diff (fecha2, 'month') > 0) {
      return fecha1.diff (fecha2, 'months') + ' mes(es)'
    }

    return  fecha1.diff (fecha2, 'days') + ' dia(s)';
  }

  filtrar () {
    // this.profesionales = this._profesionales;
    // this.profesionales = this.profesionales.filter ((item: any) => {
    //   return this.verificar_idioma (item.listaidiomas) &&
    //          this.verificar_precio (item.centros_medicos_lista);
    // });
  }

  verificar_idioma (lista: any []) {
    let valido: boolean = false;
    this.idiomas.forEach ((i: any) => {
      if (i.checked) {
        lista.forEach ((idioma: any) => {
          if (i.id == idioma.id_idioma) {
            valido = true;
          }
        });
      }
    });

    return valido;
  }

  verificar_precio (item: any) {
    let valido: boolean = false;
    item.centros_medicos_lista.forEach ((e: any) => {
      if (parseInt (e.precio_consulta) >= this.min && parseInt (e.precio_consulta) <= this.max) {
        valido = true;
      }
    });

    item.consultorios_lista.forEach ((e: any) => {
      if (parseInt (e.precio_consulta) >= this.min && parseInt (e.precio_consulta) <= this.max) {
        valido = true;
      }
    });

    return valido;
  }

  verificar_horario (item: any, hora: any []) {
    let valido: boolean = false;

    item.centros_medicos_lista.forEach ((e: any) => {
      e.horarios.forEach ((h: any) => {
        if (h.horario_atencion.split (" | ").length >= 2) {
          h.horario_atencion.split (" | ").forEach((element: any) => {
            let horas: string [] = element.split (" - ");

            let _hora_inicio = horas [0].substring (0, 5);
            if (horas [0].substring (6) === 'PM') {
              _hora_inicio = (parseInt (_hora_inicio.split (':') [0])+12).toString () + ':' + _hora_inicio.split (':') [1];
            }

            let _hora_fin = horas [1].substring (0, 5);
            if (horas [1].substring (6) === 'PM') {
              _hora_fin = (parseInt (_hora_fin.split (':') [0])+12).toString () + ':' + _hora_fin.split (':') [1];
            }

            let m_inicio = moment ('2020-10-10 ' + _hora_inicio + ':00');
            let m_fin = moment ('2020-10-10 ' + _hora_fin + ':00');

            hora.forEach ((_horasss: string) => {
              if (moment ('2020-10-10 ' + _horasss + ':00').isBetween (m_inicio, m_fin)) {
                valido = true;
              }
            });
          });
        } else {
          let horas: string [] = h.horario_atencion.split (" - ");

          let _hora_inicio = horas [0].substring (0, 5);
          if (horas [0].substring (6) === 'PM') {
            _hora_inicio = (parseInt (_hora_inicio.split (':') [0])+12).toString () + ':' + _hora_inicio.split (':') [1];
          }

          let _hora_fin = horas [1].substring (0, 5);
          if (horas [1].substring (6) === 'PM') {
            _hora_fin = (parseInt (_hora_fin.split (':') [0])+12).toString () + ':' + _hora_fin.split (':') [1];
          }

          let m_inicio = moment ('2020-10-10 ' + _hora_inicio + ':00');
          let m_fin = moment ('2020-10-10 ' + _hora_fin + ':00');

          hora.forEach ((_horasss: string) => {
            if (moment ('2020-10-10 ' + _horasss + ':00').isBetween (m_inicio, m_fin)) {
              valido = true;
            }
          });
        }
      });
    });

    item.consultorios_lista.forEach ((e: any) => {
      e.horarios.forEach ((h: any) => {
        if (h.horario_atencion.split (" | ").length >= 2) {
          h.horario_atencion.split (" | ").forEach((element: any) => {
            let horas: string [] = element.split (" - ");

            let _hora_inicio = horas [0].substring (0, 5);
            if (horas [0].substring (6) === 'PM') {
              _hora_inicio = (parseInt (_hora_inicio.split (':') [0])+12).toString () + ':' + _hora_inicio.split (':') [1];
            }

            let _hora_fin = horas [1].substring (0, 5);
            if (horas [1].substring (6) === 'PM') {
              _hora_fin = (parseInt (_hora_fin.split (':') [0])+12).toString () + ':' + _hora_fin.split (':') [1];
            }

            let m_inicio = moment ('2020-10-10 ' + _hora_inicio + ':00');
            let m_fin = moment ('2020-10-10 ' + _hora_fin + ':00');

            hora.forEach ((_horasss: string) => {
              if (moment ('2020-10-10 ' + _horasss + ':00').isBetween (m_inicio, m_fin)) {
                valido = true;
              }
            });
          });
        } else {
          let horas: string [] = h.horario_atencion.split (" - ");

          let _hora_inicio = horas [0].substring (0, 5);
          if (horas [0].substring (6) === 'PM') {
            _hora_inicio = (parseInt (_hora_inicio.split (':') [0])+12).toString () + ':' + _hora_inicio.split (':') [1];
          }

          let _hora_fin = horas [1].substring (0, 5);
          if (horas [1].substring (6) === 'PM') {
            _hora_fin = (parseInt (_hora_fin.split (':') [0])+12).toString () + ':' + _hora_fin.split (':') [1];
          }

          let m_inicio = moment ('2020-10-10 ' + _hora_inicio + ':00');
          let m_fin = moment ('2020-10-10 ' + _hora_fin + ':00');

          hora.forEach ((_horasss: string) => {

            if (moment ('2020-10-10 ' + _horasss + ':00').isBetween (m_inicio, m_fin)) {
              valido = true;
            }
          });
        }
      });
    });

    return valido;
  }

  ver (item: any) {
    this.navController.navigateForward (['perfil-doctor', item.id]);
  }
}
