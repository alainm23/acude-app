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
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.obtener_informacion_profesionales_lista  (this.route.snapshot.paramMap.get ('string_cm'), this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      console.log (res);
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
              doctor.info_doctor.promedio_calificacion = doctor.promedio_calificacion;
              doctor.info_doctor.cantidad_comentario = doctor.cantidad_comentario;
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
      return 'assets/img/ion-avatar.png';
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
        if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_reserva === '1') {
          if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
            returned = true;
          }
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

  get_promedio (promedio_calificacion: number) {
    return promedio_calificacion.toFixed (1);
  }
}
