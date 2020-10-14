import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { NavController, LoadingController, IonSlides } from '@ionic/angular';
declare var google: any;

// Geo
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-mapa-establecimientos',
  templateUrl: './mapa-establecimientos.page.html',
  styleUrls: ['./mapa-establecimientos.page.scss'],
})
export class MapaEstablecimientosPage implements OnInit {
  @ViewChild (IonSlides, { static: false }) slides: IonSlides;
  @ViewChild('map', { static: false }) mapRef: ElementRef;
  @ViewChild ('searchbar', { read: ElementRef, static: false }) searchbar: ElementRef;
  map: any = null;

  kilometros: number = 20;
  latitude: number;
  longitude: number;
  search_text: string = "";

  markers: any [] = [];
  tipos_centros_medicos: any [] = [];
  sucursales: any [] = [];
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 10,
  };
  id: string;
  nombre: string;
  constructor (
    private navController: NavController,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private api: ApiService,
    private route: ActivatedRoute) {}

  async ngOnInit () {
    this.id = this.route.snapshot.paramMap.get ('id');
    this.nombre = this.route.snapshot.paramMap.get ('nombre');

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_tipos_centros_medicos ('tipos-centros-medicos').subscribe ((res: any) => {
      Object.entries(res.tipos_centros_medicos).forEach ((val: any) => {
        this.tipos_centros_medicos.push ({
          id: val [0],
          nombre: val [1]
        })
      });
    });

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

    this.api.obtener_centros_medicos  (this.latitude, this.longitude, this.kilometros, this.id).subscribe ((res: any) => {
      console.log ('resultados', res);
      this.sucursales = res.sucursales;
      loading.dismiss ();

      this.clear_markers ();

      res.sucursales.forEach ((cliente: any) => {
        let marker: any = new google.maps.Marker ({
          position: new google.maps.LatLng (+cliente.latitud, +cliente.longitud),
          animation: google.maps.Animation.DROP,
          map: this.map
        });

        marker.addListener ("click", () => {
          this.navController.navigateForward (['perfil-clinica', cliente.id]);
        });

        this.markers.push (marker);
      });
    }, error => {
      loading.dismiss ();
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

    if (this.kilometros > 5) {
      this.kilometros = 5;
    }

    this.draw_marks ();
  }

  ver_lista () {
    let ids: string = this.sucursales.map((elem: any) => {
      return elem.id;
    }).join (",");
    if (ids === '') {
      ids = 'null';
    }

    this.navController.navigateForward (['establecimientos-salud-lista', ids]);    
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

  slides_categoria_changed () {
    this.slides.getActiveIndex ().then ((index: number) => {
      console.log (index);
      this.id = this.tipos_centros_medicos [index].id;
      this.draw_marks ();
    });
  }
}
