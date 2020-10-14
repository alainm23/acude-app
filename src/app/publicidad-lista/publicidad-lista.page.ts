import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-publicidad-lista',
  templateUrl: './publicidad-lista.page.html',
  styleUrls: ['./publicidad-lista.page.scss'],
})
export class PublicidadListaPage implements OnInit {
  @ViewChild (IonSlides, { static: false }) slide_categorias: IonSlides;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 10,
  };

  categorias: any [] = []
  publicidades: any [] = [];
  _publicidades: any [] = [];
  constructor (
    private api: ApiService,
    private route: ActivatedRoute,
    private navController: NavController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() { 
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();
    
    this.api.get_categoria_publicidades ().subscribe ((res: any) => {
      Object.entries(res.categorias).forEach ((val: any) => {
        this.categorias.push ({
          id: val [0],
          nombre: val [1]
        })
      });

      console.log ()
    });

    this.api.get_all_listado_publicidades ().subscribe ((res: any) => {
      console.log (res);
      this.publicidades = res.publicidades;
      this._publicidades = res.publicidades;
      loading.dismiss ();
    });
  }

  slides_categoria_changed () {
    this.slide_categorias.getActiveIndex ().then ((index: number) => {
      this.publicidades = this._publicidades;
      if (index !== 0) {
        console.log (this.categorias [index-1]);
        this.publicidades = this.publicidades.filter ((item: any) => {
          return item.id_categoria === parseInt (this.categorias [index-1].id);
        });
      }
    });
  }

  ver_detalle_publicidad (item: any) {
    this.navController.navigateForward (['publicidad-detalle', item.id, item.id_categoria]);
  }

  back () {
    this.navController.back ();
  }
}
