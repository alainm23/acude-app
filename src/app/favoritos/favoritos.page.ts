import { Component, OnInit, ViewChild } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { LoadingController, NavController, IonSlides } from '@ionic/angular';
import * as moment from 'moment';

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
    private navController: NavController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create ({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_favoritos ().subscribe ((res: any) => {
      console.log (res);

      this.profesionales = res.profesionales;
      this.centros_medicos = res.centros_medicos_sucursales;

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
    this.navController.navigateForward (['perfil-clinica', item.id_centro_medico]);
  }

  slides_categoria_changed () {
    this.slide.getActiveIndex ().then ((index: number) => {
      console.log (index);
      this.index = index;
    });
  }
}
