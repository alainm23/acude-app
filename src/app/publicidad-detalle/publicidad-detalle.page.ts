import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, IonSlides } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

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
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 10,
  };
  constructor (
    private api: ApiService,
    private route: ActivatedRoute,
    private navController: NavController,
    private loadingController: LoadingController,
    private callNumber: CallNumber
  ) { }

  async ngOnInit() { 
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();
    
    this.api.get_categoria_publicidades (16).subscribe ((res: any) => {
      this.categorias = res.categorias;
      console.log ('categorias', this.categorias);

      this.get_publicaciones_by_categoria (
        this.route.snapshot.paramMap.get ('categoria_id'),
        loading
      );
    });
  }

  get_publicaciones_by_categoria (id_categoria: string, loading: any) {
    this.api.get_listado_publicaciones_by_categoria (id_categoria).subscribe ((res: any) => {
      console.log (res);
      this.publicidades = res.publicidades;
      loading.dismiss ();

      this.get_publicidad_by_id (this.route.snapshot.paramMap.get ('id'));
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
      console.log (index);
      this.datos = this.publicidades [index];
    });
  }

  async slides_categoria_changed () {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.slide_categorias.getActiveIndex ().then ((index: number) => {
      console.log (this.categorias [index]);

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
