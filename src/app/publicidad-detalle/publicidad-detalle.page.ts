import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, IonSlides } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-publicidad-detalle',
  templateUrl: './publicidad-detalle.page.html',
  styleUrls: ['./publicidad-detalle.page.scss'],
})
export class PublicidadDetallePage implements OnInit {
  @ViewChild ('slide_categorias', { static: false }) slide_categorias: IonSlides;
  @ViewChild ('slide_publicidades', { static: false }) slide_publicidades: IonSlides;
  datos: any = {
    imagen: ''
  };

  categorias: any [] = [];
  publicidades: any [] = [];
  slideOptsOne = {
    slidesPerView: 3,
    spaceBetween: 10,
  };

  constructor (
    private api: ApiService,
    private route: ActivatedRoute,
    private navController: NavController,
    private loadingController: LoadingController,
    private callNumber: CallNumber,
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
      console.log ('categorias', res.categorias);
      this.categorias = res.categorias;
      loading.dismiss ();

      if (this.get_index_categoria (this.route.snapshot.paramMap.get ('categoria_id')) <= 0) {
        this.get_publicaciones_by_categoria (
          this.route.snapshot.paramMap.get ('categoria_id'),
          loading
        );
      } else {
        setTimeout (() => {
          this.slide_categorias.slideTo (
            this.get_index_categoria (this.route.snapshot.paramMap.get ('categoria_id'))
          );
        }, 250);
      }
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  get_index_categoria (id: string) {
    let index = 0;
    
    for (let i = 0; i < this.categorias.length; i++) {
      if (this.categorias [i].id == id) {
        index = i;
      }
    }
    return index;
  }

  get_publicaciones_by_categoria (id_categoria: string, loading: any) {
    this.api.get_listado_publicaciones_by_categoria (id_categoria).subscribe ((res: any) => {
      this.publicidades = res.publicidades;
      loading.dismiss ();
      this.get_publicidad_by_id (this.route.snapshot.paramMap.get ('id'));
    }, error => {
      console.log (error);
      loading.dismiss ();
    });
  }

  back () {
    this.navController.back ();
  }

  get_publicidad_by_id (id: string) {
    let encontrado: boolean = false;
    this.publicidades.forEach ((e: any) => {
      if (e.id === parseInt (id)) {
        console.log ('encontrado', e);
        this.datos = e;
        encontrado = true;
      }
    });

    if (encontrado === false) {
      this.datos = this.publicidades [0];
    }
  }

  slidesChanged () {
    this.slide_publicidades.getActiveIndex ().then ((index: number) => {
      this.datos = this.publicidades [index];
    });
  }

  async slides_categoria_changed () {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.slide_categorias.getActiveIndex ().then ((index: number) => {
      this.get_publicaciones_by_categoria (
        this.categorias [index].id,
        loading
      );
    });
  }

  llamar (telefono: any) {
    if (telefono !== null) {
      this.callNumber.callNumber (telefono, true)
      .then (res => console.log ('Launched dialer!', res))
      .catch (err => console.log ('Error launching dialer', err));
    }
  }
}
