import { Component, OnInit } from '@angular/core';

// Services
import { LoadingController, PopoverController, NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';

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
    slidesPerView: 2.3,
    spaceBetween: 10,
  };
  constructor (
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private navController: NavController,
    private api: ApiService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private callNumber: CallNumber) {}

  async ngOnInit() {
    this.nombre = this.route.snapshot.paramMap.get ('nombre');
    console.log ('string_cm', this.route.snapshot.paramMap.get ('string_cm'));

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.obtener_informacion_profesionales_lista  (
      this.route.snapshot.paramMap.get ('string_cm'),
      this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      // console.log (res);
      this.precio_minimo = res.data.precio_minimo;
      this.precio_maximo = res.data.precio_maximo;
      this.min = res.data.verificar_precio;
      this.max = res.data.precio_maximo

      res.data.sucursales.forEach ((sucursal: any) => {
        sucursal.doctores.forEach ((doctor: any) => {
          if (doctor.info_doctor !== undefined && doctor.info_doctor !== null) {
            if (this.profesionales.find (x => x.id === doctor.info_doctor.id) === undefined) {
              doctor.info_doctor.direccion = sucursal.direccion;
              doctor.info_doctor.denominacion = sucursal.denominacion;
              this.profesionales.push (doctor.info_doctor);
            }
          }
        });
      });

      this._profesionales = res.data.profesionales;
      console.log (this.profesionales);
      loading.dismiss ();
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

  get_foto (data: any) {
    if (data.fotografia === null) {
      return 'data:image/png;base64,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';
    }

    return 'https://www.acudeapp.com/storage/' + data.fotografia;
  }

  verificar_precio (item: any) {
    let valido: boolean = false;
    item.centros_medicos_lista.forEach ((e: any) => {
      if (parseInt (e.precio_consulta) >= this.min && parseInt (e.precio_consulta) <= this.max) {
        valido = true;
      }
    });

    // item.consultorios_lista.forEach ((e: any) => {
    //   if (parseInt (e.precio_consulta) >= this.min && parseInt (e.precio_consulta) <= this.max) {
    //     valido = true;
    //   }
    // });

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

    // item.consultorios_lista.forEach ((e: any) => {
    //   e.horarios.forEach ((h: any) => {
    //     if (h.horario_atencion.split (" | ").length >= 2) {
    //       h.horario_atencion.split (" | ").forEach((element: any) => {
    //         let horas: string [] = element.split (" - ");

    //         let _hora_inicio = horas [0].substring (0, 5);
    //         if (horas [0].substring (6) === 'PM') {
    //           _hora_inicio = (parseInt (_hora_inicio.split (':') [0])+12).toString () + ':' + _hora_inicio.split (':') [1];
    //         }

    //         let _hora_fin = horas [1].substring (0, 5);
    //         if (horas [1].substring (6) === 'PM') {
    //           _hora_fin = (parseInt (_hora_fin.split (':') [0])+12).toString () + ':' + _hora_fin.split (':') [1];
    //         }

    //         let m_inicio = moment ('2020-10-10 ' + _hora_inicio + ':00');
    //         let m_fin = moment ('2020-10-10 ' + _hora_fin + ':00');

    //         hora.forEach ((_horasss: string) => {
    //           if (moment ('2020-10-10 ' + _horasss + ':00').isBetween (m_inicio, m_fin)) {
    //             valido = true;
    //           }
    //         });
    //       });
    //     } else {
    //       let horas: string [] = h.horario_atencion.split (" - ");

    //       let _hora_inicio = horas [0].substring (0, 5);
    //       if (horas [0].substring (6) === 'PM') {
    //         _hora_inicio = (parseInt (_hora_inicio.split (':') [0])+12).toString () + ':' + _hora_inicio.split (':') [1];
    //       }

    //       let _hora_fin = horas [1].substring (0, 5);
    //       if (horas [1].substring (6) === 'PM') {
    //         _hora_fin = (parseInt (_hora_fin.split (':') [0])+12).toString () + ':' + _hora_fin.split (':') [1];
    //       }

    //       let m_inicio = moment ('2020-10-10 ' + _hora_inicio + ':00');
    //       let m_fin = moment ('2020-10-10 ' + _hora_fin + ':00');

    //       hora.forEach ((_horasss: string) => {

    //         if (moment ('2020-10-10 ' + _horasss + ':00').isBetween (m_inicio, m_fin)) {
    //           valido = true;
    //         }
    //       });
    //     }
    //   });
    // });

    return valido;
  }

  ver (item: any) {
    this.navController.navigateForward (['perfil-doctor', item.id]);
  }

  llamar (telefono: any) {
    this.callNumber.callNumber (telefono, true)
    .then (res => console.log ('Launched dialer!', res))
    .catch (err => console.log ('Error launching dialer', err));
  }

  validar_disponibilidad (datos: any) {
    let returned: boolean = false;

    if (datos.centros_medicos_lista !== undefined) {
      datos.centros_medicos_lista.forEach ((centro: any) => {
        if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
          returned = true;
        }
      });
    }

    return returned;
  }

  async reservar_select (datos: any) {
    console.log (datos);

    if (datos.centros_medicos_lista.length <= 1) {
      this.reservar (datos, datos.centros_medicos_lista [0]);
    } else {
      let inputs: any [] = [];
      let size: number = 0;
      datos.centros_medicos_lista.forEach ((centro: any) => {
        if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
          size++;
        }
      });

      if (size <= 1) {
        datos.centros_medicos_lista.forEach ((centro: any) => {
          if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
            this.reservar (datos, centro);
          }
        });
      } else {
        datos.centros_medicos_lista.forEach ((centro: any) => {
          if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
            inputs.push ({
              name: 'radio1',
              type: 'radio',
              label: datos.denominacion,
              value: centro,
            });
          }
        });

        const alert = await this.alertController.create({
          header: 'Seleccione un centro de atencion',
          inputs: inputs,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Seleccionar',
              handler: (data: any) => {
                this.reservar (datos, data);
              }
            }
          ]
        });
    
        await alert.present ();
      }
    }
  }

  reservar (datos: any, centro: any) {
    console.log (centro);

    let data: any = {
      centro_medico_id: centro.id,
      direccion: centro.info_centro_medico_sucursal_tarjeta_medico.direccion,
      precio: centro.precio_consulta,
      editar: false
    };

    this.navController.navigateForward (
      ['escoje-fecha-hora', JSON.stringify ({
        id: datos.id,
        nombre_completo: datos.nombre_completo,
        especialidad: datos.especialidad,
        brinda_telemedicina: datos.brinda_telemedicina,
        fotografia: datos.fotografia
      }), JSON.stringify (data)]
    );
  }
}
