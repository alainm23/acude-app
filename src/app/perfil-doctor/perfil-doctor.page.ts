import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
declare var google: any;
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
  constructor (
    private api: ApiService,
    private route: ActivatedRoute,
    private navController: NavController,
    private loadingController: LoadingController,
    private socialSharing: SocialSharing
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.obtener_informacion_completa_profesional (this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      console.log (res);
      console.log (res.profesional [0]);
      this.datos = res.profesional [0];
      if (res.estado_favorito === 1) {
        this.favorito = true;
      }

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

  toggle_consultorio (consultorio: any) {
    if (consultorio.visible === undefined) {
      consultorio.visible = true;
      return;
    }

    consultorio.visible = !consultorio.visible;
  }

  draw_mapa (consultorio: any) {
    if (this.mapas.get (consultorio.id) === undefined) {
      let map_ref = document.getElementById ('consultorio_' + consultorio.id);

      let point = new google.maps.LatLng (+consultorio.latitud, +consultorio.longitud);

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

      this.mapas.set (consultorio.id, map);
    }
  }

  draw_mapa_centros_medicos (id: string, centro: any) {
    if (this.mapas.get (centro.id) === undefined) {
      let map_ref = document.getElementById ('centros_medicos_' + id);

      let point = new google.maps.LatLng (+centro.latitud, +centro.longitud);

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
    const url = 'https://acudeapp.com/?type=doctor?id=' + this.route.snapshot.paramMap.get ('id');
    const mensaje = "Conectate con " + this.datos.nombre_completo + " en AcudeAPP " + url;
    this.socialSharing.share (mensaje);
  }

  send_email () {
    // this.socialSharing.shareViaEmail ('', '', )
  }

  ver_clinica (id: string) {
    this.navController.navigateForward (['perfil-clinica', id]);
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
}
