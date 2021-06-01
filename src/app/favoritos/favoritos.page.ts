import { Component, OnInit, ViewChild } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { LoadingController, NavController, IonSlides, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  @ViewChild (IonSlides, { static: false }) slide: IonSlides;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 10,
  };
  profesionales: any [] = [];
  centros_medicos: any [] = [];
  index: number = 0;
  constructor (
    private api: ApiService,
    private loadingController: LoadingController,
    private navController: NavController, private callNumber: CallNumber, private alertController: AlertController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create ({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_favoritos ().subscribe ((res: any) => {
      console.log (res);

      this.profesionales = res.data.profesionales;
      this.centros_medicos = res.data.centros_medicos_sucursales;

      loading.dismiss ();
    });
  }

  back () {
    this.navController.back ();
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

  ver (item: any) {
    this.navController.navigateForward (['perfil-doctor', item.id]);
  }

  ver_clinica (item: any) {
    this.navController.navigateForward (['perfil-clinica', item.id_centro_medico, -1]);
  }

  slides_categoria_changed () {
    this.slide.getActiveIndex ().then ((index: number) => {
      console.log (index);
      this.index = index;
    });
  }
  
  slide_to (index: number) {
    this.slide.slideTo (index);
  }

  get_foto (imagen: string) {
    if (imagen === '' || imagen === null || imagen === undefined) {
      return 'assets/img/ion-avatar.png';
    }

    return 'https://www.acudeapp.com/storage/' + imagen;
  }

  get_foto_centro (imagen: string) {
    if (imagen === '' || imagen === null || imagen === undefined) {
      return 'assets/img/icono_clinica.jpg'
    }

    return 'https://www.acudeapp.com/storage/' + imagen;
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

  llamar (telefono: any) {
    this.callNumber.callNumber (telefono, true)
    .then (res => console.log ('Launched dialer!', res))
    .catch (err => console.log ('Error launching dialer', err));
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
              label: centro.info_centro_medico_sucursal.denominacion,
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
