import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, PopoverController } from '@ionic/angular';
declare var google: any;
import { SelectSucursalPage } from '../popovers/select-sucursal/select-sucursal.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-perfil-clinica',
  templateUrl: './perfil-clinica.page.html',
  styleUrls: ['./perfil-clinica.page.scss'],
})
export class PerfilClinicaPage implements OnInit {
  @ViewChild ('map', { static: false }) mapRef: ElementRef;
  map: any = null;
  marker: any = null;

  datos: any = {
    logotipo: ''
  };
  sucursal: any;
  favorito: boolean = false;
  vista: string = '0';
  
  constructor (
    private api: ApiService,
    private route: ActivatedRoute,
    private navController: NavController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private socialSharing: SocialSharing
  ) { }

  async ngOnInit() { 
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_detalle_centro_medico (this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      console.log (res);
      this.datos = res.informacion_centro_medico [0];
      if (res.informacion_centro_medico [0].sucursales instanceof Array && res.informacion_centro_medico [0].sucursales.length > 0) {
        this.sucursal = res.informacion_centro_medico [0].sucursales [0];
        this.initMap ();
      }

      if (res.estado_favorito === 1) {
        this.favorito = true;
      }

      loading.dismiss ();
    });
  }

  back () {
    this.navController.back ();
  }

  initMap () {
    let point = new google.maps.LatLng (this.sucursal.latitud, this.sucursal.longitud);

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

    if (this.map === null) {
      this.map = new google.maps.Map (this.mapRef.nativeElement, options);
    } else {
      this.map.panTo (point);
    }

    if (this.marker === null) {
      this.marker = new google.maps.Marker ({
        position: new google.maps.LatLng (this.sucursal.latitud, this.sucursal.longitud),
        animation: google.maps.Animation.DROP,
        map: this.map
      });
    } else {
      this.marker.setPosition (point);
    }
  }

  async toggle_favorito () {
    console.log (this.sucursal);
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    if (this.favorito) {
      this.api.eliminar_favorito (1, this.sucursal.id).subscribe ((res: any) => {
        loading.dismiss ();
        console.log (res);
        this.favorito = false;
      }, (error: any) => {
        loading.dismiss ();
        console.log (error)
      });
    } else {
      this.api.agregar_favorito (1, this.sucursal.id).subscribe ((res: any) => {
        console.log (res);
        loading.dismiss ();
        this.favorito = true;
      }, (error: any) => {
        loading.dismiss ();
        console.log (error)
      });
    }
  }

  async cambiar_sucursal (e: any) {
    const popover = await this.popoverController.create({
      component: SelectSucursalPage,
      componentProps: {
        items: this.datos.sucursales
      },
      showBackdrop: true,
      event: e
    });

    popover.onDidDismiss ().then (async (response: any) => {
      console.log (response);
      if (response.role === 'ok') {
        this.sucursal = response.data;
        this.initMap ();
      }
    });

    return await popover.present ();
  }

  share () {
    const url = 'https://acudeapp.com/?type=centro-medico?id=' + this.route.snapshot.paramMap.get ('id');
    const mensaje = "Conectate con " + this.datos.nombre_completo + " en AcudeAPP " + url;
    this.socialSharing.share (mensaje);
  }

  get_servicios (item: any) {
    if (item.servicios === null) {
      return [];
    }

    return item.servicios.split (',');
  }

  get_imagen () {
    return 'http://appmedico.demoperu.site/storage/' + this.datos.logotipo
  }

  go_perfil (item: any) {
    this.navController.navigateForward (['perfil-doctor', item.id])
  }
}
