import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';

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
    private loadingController: LoadingController,
    private storage: Storage
  ) { }

  async ngOnInit() {
    let departamento_id = await this.storage.get ('DEPARTAMENTO_SELECCIONADO');
    if (departamento_id === null) {
      departamento_id = this.api.USUARIO_DATA.departamento_id;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();
    
    this.api.get_categoria_publicidades (departamento_id).subscribe ((res: any) => {
      this.categorias = res.categorias;
      console.log (res);
    });

    this.api.get_listado_publicidades (departamento_id, 0).subscribe ((res: any) => {
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
