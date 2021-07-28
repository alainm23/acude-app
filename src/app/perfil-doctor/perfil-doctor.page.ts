import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
declare var google: any;
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-perfil-doctor',
  templateUrl: './perfil-doctor.page.html',
  styleUrls: ['./perfil-doctor.page.scss'],
})
export class PerfilDoctorPage implements OnInit {
  datos: any = {
    fotografia: ''
  };

  mapas = new Map <string, any> ();
  favorito: boolean = false;
  todos_los_comentarios: boolean = false;
  boton_color: boolean = false;
  promedio_calificacion: number = 0;
  constructor (
    private api: ApiService,
    private route: ActivatedRoute,
    private navController: NavController,
    private loadingController: LoadingController,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.obtener_informacion_completa_profesional (this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      console.log (res);
      // console.log (res.data.profesional);
      this.promedio_calificacion = res.data.promedio_calificacion;
      this.datos = res.data.profesional;
      if (res.data.estado_favorito === 1) {
        this.favorito = true;
      }

      loading.dismiss ();
    });
  }

  back () {
    this.navController.back ();
  }

  get_foto (data: any) {
    if (data.fotografia === null) {
      return 'assets/img/ion-avatar.png';
    }

    return 'https://www.acudeapp.com/storage/' + data.fotografia;
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

  toggle_consultorio (consultorio: any) {
    if (consultorio.visible === undefined) {
      consultorio.visible = true;
      return;
    }

    consultorio.visible = !consultorio.visible;
  }

  draw_mapa_centros_medicos (id: string, centro: any) {
    if (this.mapas.get (centro.id) === undefined) {
      let map_ref = document.getElementById ('centros_medicos_' + id);
      let latitud: any = 0;
      let longitud: any = 0;

      if (centro.latitud !== null) {
        latitud = centro.latitud;
      }

      if (centro.longitud !== null) {
        longitud = centro.longitud;
      }

      let point = new google.maps.LatLng (parseFloat (latitud), parseFloat (longitud));

      const options = {
        center: point,
        zoom: 15,
        disableDefaultUI: true,
        streetViewControl: false,
        disableDoubleClickZoom: false,
        clickableIcons: false,
        scaleControl: true,
        mapTypeId: 'roadmap'
      }
      
      let map = new google.maps.Map (map_ref, options);

      let marker = new google.maps.Marker({
        position: point,
        animation: google.maps.Animation.DROP,
        map: map
      });

      this.mapas.set (centro.id, map);
    }
  }

  share () {
    const url = 'https://acudeapp.com/?type=doctor?id=' + this.datos.id;
    const mensaje = `Te recomiendo al ${ this.datos.tratamiento } ${ this.datos.nombre_completo } (${ this.datos.especialidad.categoria_especialidad.nombre } ${ this.datos.especialidad.nombre }), puedes encontrarlo(a) en ACUDE APP ${ url }`;
    console.log (mensaje);
    this.socialSharing.share (mensaje);
  }

  send_email (correo: string) {
    this.socialSharing.shareViaEmail ('', '', [correo])
  }

  ver_clinica (id: string) {
    this.navController.navigateForward (['perfil-clinica', id, -1]);
  }

  llamar (telefono: any) {
    this.callNumber.callNumber (telefono, true)
    .then (res => console.log ('Launched dialer!', res))
    .catch (err => console.log ('Error launching dialer', err));
  }

  async toggle_favorito () {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    if (this.favorito) {
      this.api.eliminar_favorito (0, this.datos.id).subscribe ((res: any) => {
        loading.dismiss ();
        console.log (res);
        this.favorito = false;
      }, (error: any) => {
        loading.dismiss ();
        console.log (error)
      });
    } else {
      this.api.agregar_favorito (0, this.datos.id).subscribe ((res: any) => {
        console.log (res);
        loading.dismiss ();
        this.favorito = true;
      }, (error: any) => {
        loading.dismiss ();
        console.log (error)
      });
    }
  }

  reservar (centro: any) {
    console.log(centro);

    let data: any = {
      centro_medico_id: centro.id,
      direccion: centro.info_centro_medico_sucursal_tarjeta_medico.direccion,
      modo_consulta: centro.modo_consulta,
      editar: false
    };

    if (centro.modo_consulta === '0') {
      data.precio_consulta = centro.precio_consulta;
    } else if (centro.modo_consulta === '1') {
      data.precio_consulta_telemedicina = centro.precio_consulta_telemedicina;
    } else {
      data.precio_consulta = centro.precio_consulta;
      data.precio_consulta_telemedicina = centro.precio_consulta_telemedicina;
    }

    let brinda_telemedicina = 0;
    if (this.datos.brinda_telemedicina === 1) {
      brinda_telemedicina = 1;
    }

    console.log (brinda_telemedicina);

    this.navController.navigateForward (
      ['escoje-fecha-hora',
      JSON.stringify ({
        id: this.datos.id,
        nombre_completo: this.datos.nombre_completo,
        especialidad: this.datos.especialidad,
        brinda_telemedicina: brinda_telemedicina,
        fotografia: this.datos.fotografia,
        telefono: this.datos.telefono_celular,
        tipo_cobro: this.datos.tipo_cobro,
        nombre_banco: this.datos.nombre_banco,
        nro_cuenta: this.datos.nro_cuenta,
        telefono_yape: this.datos.telefono_yape,
        interbancario: this.datos.interbancario
      }),
      JSON.stringify (data)
      ]
    );
  }

  async reservar_select () {
    console.log (this.datos);
    if (this.datos.centros_medicos_lista.length <= 1) {
      this.reservar (this.datos.centros_medicos_lista [0]);
    } else {
      let inputs: any [] = [];
      let size: number = 0;
      this.datos.centros_medicos_lista.forEach ((centro: any) => {
        if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_reserva === '1') {
          size++;
        } else {
          if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
            size++;
          }
        }
      });

      if (size <= 1) {
        this.datos.centros_medicos_lista.forEach ((centro: any) => {
          if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
            this.reservar (centro);
          }
        });
      } else {
        this.datos.centros_medicos_lista.forEach ((centro: any) => {
          inputs.push ({
            name: 'radio1',
            type: 'radio',
            label: centro.info_centro_medico_sucursal_tarjeta_medico.infocentro_medico_tarjeta.nombre_comercial,
            value: centro,
          })
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
                this.reservar (data);
              }
            }
          ]
        });
    
        await alert.present ();
      }
    }
  }

  validar_disponibilidad (datos: any) {
    let returned: boolean = false;

    if (datos.centros_medicos_lista !== undefined) {
      datos.centros_medicos_lista.forEach ((centro: any) => {
        if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_reserva === '1') {
          returned = true;
        } else {
          if (centro.info_centro_medico_sucursal_tarjeta_medico.tipo_centro_medico.tipo_reserva === '1') {
            returned = true;
          }
        }
      });
    }

    return returned;
  }

  validar_visible (datos: any) {
    let returned: boolean = false;

    if (datos.tipo_reserva === '1') {
      returned = true;
    } else {
      if (datos.tipo_centro_medico.tipo_reserva === '1') {
        returned = true;
      }
    }

    return returned;
  }

  get_comentarios (centros: any []) {
    if (centros === null || centros === undefined) {
      return [];
    }

    let comentarios = [];

    centros.forEach ((centro: any) => {
      centro.citas_culminadas.forEach ((cita: any) => {
        if (cita.comentario !== null) {
          if (cita.comentario.estado === '1') {
            comentarios.push ({
              comentario: cita.comentario.descripcion,
              fecha: cita.created_at,
              paciente: cita.paciente.nombres,
              pun: cita.comentario.puntuacion_1
            });
          }
        }
      });
    });

    if (this.todos_los_comentarios) {
      return comentarios;
    } else {
      if (comentarios.length >= 3) {
        return [comentarios [0], comentarios [1], comentarios [2]];
      } else {
        return comentarios;
      }
    }

    return comentarios;
  }

  get_start (pun: number) {
    let array = [];

    for (let index = 0; index < pun; index++) {
      array.push (index);
    }

    return array;
  }

  get_relative_datetime (date: string) {
    if (date === null || date === undefined) {
      return '';
    }

    return moment (date).fromNow (); 
  }

  toggle_comentarios () {
    this.todos_los_comentarios = !this.todos_los_comentarios;
  }

  get_promedio (promedio_calificacion: number) {
    return promedio_calificacion.toFixed (1);
  }
}
