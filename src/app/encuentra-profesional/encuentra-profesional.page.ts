import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { NavController, LoadingController } from '@ionic/angular';
declare var google: any;

// Geo
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { strict } from 'assert';

@Component({
  selector: 'app-encuentra-profesional',
  templateUrl: './encuentra-profesional.page.html',
  styleUrls: ['./encuentra-profesional.page.scss'],
})
export class EncuentraProfesionalPage implements OnInit {
  @ViewChild ('map', { static: false }) mapRef: ElementRef;
  @ViewChild ('searchbar', { read: ElementRef, static: false }) searchbar: ElementRef;
  map: any = null;
  search_text: string = '';

  kilometros: number = 5;
  latitude: number;
  longitude: number;

  markers: any [] = [];
  nombre: string = '';
  consultorios: any [] = [];
  centros_medicos: any [] = [];
  constructor (
    private navController: NavController,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private api: ApiService,
    private route: ActivatedRoute) {}

  async ngOnInit () {
    this.nombre = this.route.snapshot.paramMap.get ('nombre');

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.geolocation.getCurrentPosition ().then ((resp: Geoposition) => {
      loading.dismiss ();

      this.latitude = -13.534499;//resp.coords.latitude;
      this.longitude = -71.9676677; //resp.coords.longitude;

      this.initMap (-13.534499, -71.9676677);
      this.draw_marks ();
      this.initAutocomplete ();
     }).catch ((error) => {
       console.log('Error getting location', error);
     });
  }

  clear_markers () {
    this.markers.forEach ((marker: any) => {
      marker.setMap (null);
    });

    this.markers = [];
  }

  async draw_marks () {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    console.log (this.kilometros);

    this.api.obtener_profesionales_ubicacion  (this.latitude, this.longitude, this.kilometros, this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();

      this.clear_markers ();

      this.consultorios = res.consultorios;
      res.consultorios.forEach((cliente: any) => {
        let marker: any = new google.maps.Marker ({
          position: new google.maps.LatLng (+cliente.latitud, +cliente.longitud),
          animation: google.maps.Animation.DROP,
          map: this.map
        });

        marker.addListener ("click", () => {
          this.navController.navigateForward (['perfil-doctor', cliente.id]);
        });

        this.markers.push (marker);
      });

      this.centros_medicos = res.centros_medicos;
      res.centros_medicos.forEach((cliente: any) => {
        let marker: any = new google.maps.Marker({
          position: new google.maps.LatLng (+cliente.latitud, +cliente.longitud),
          animation: google.maps.Animation.DROP,
          map: this.map
        });

        marker.addListener ("click", () => {
          this.navController.navigateForward (['perfil-doctor', cliente.id]);
        });

        this.markers.push (marker);
      });
    }, (error: any) => {
      console.log (error);
    });
  }

  initMap (latitude: number, longitude: number)  {
    let point = new google.maps.LatLng (latitude, longitude);

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
    }
  }

  back () {
    this.navController.back ();
  }

  update_kilometros (value: number) {
    this.kilometros += value;

    if (this.kilometros < 1) {
      this.kilometros = 1;
    }

    // if (this.kilometros > 20) {
    //   this.kilometros = 20;
    // }

    this.draw_marks ();
  }

  ver_lista () {
    let centros_medicos: string = this.centros_medicos.map((elem: any) => {
        return elem.id_sucursal;
    }).join (",");
    if (centros_medicos === '') {
      centros_medicos = 'null';
    }

    let consultorios: string = this.consultorios.map((elem: any) => {
      return elem.id_consultorio;
    }).join (",");
    if (consultorios === '') {
      consultorios = 'null';
    }

    this.navController.navigateForward (['encuentra-profesional-lista', consultorios, centros_medicos, this.nombre]);  
  }

  initAutocomplete () {
    const options = {
      types: ['establishment'],
      componentRestrictions: {country: "pe"}
    };
    
    let searchInput = this.searchbar.nativeElement.querySelector ('input');
    let autocomplete = new google.maps.places.Autocomplete (searchInput);

    google.maps.event.addListener (autocomplete, 'place_changed', async () => {
      const loading = await this.loadingController.create({
        message: 'Procesando...',
      });

      await loading.present();
      
      await loading.dismiss ().then(() => {
        let place = autocomplete.getPlace ()
        this.search_text = place.formatted_address;

        let location = new google.maps.LatLng (place.geometry.location.lat (), place.geometry.location.lng ());

        this.latitude = place.geometry.location.lat ();
        this.longitude = place.geometry.location.lng ();

        this.map.setZoom (17);
        this.map.panTo (location);
        this.draw_marks ();
      });
    });
  }
}
