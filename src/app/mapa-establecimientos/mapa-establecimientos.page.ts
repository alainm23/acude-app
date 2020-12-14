import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { NavController, LoadingController, IonSlides, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
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

  kilometros: number = -1;
  latitude: number;
  longitude: number;
  search_text: string = "";

  markers: any [] = [];
  tipos_centros_medicos: any [] = [];
  sucursales: any [] = [];
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1.5,
    spaceBetween: 0,
  };
  id: string;
  nombre: string;
  constructor (
    private navController: NavController,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private api: ApiService,
    private locationAccuracy: LocationAccuracy,
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private route: ActivatedRoute) {}

  async ngOnInit () {
    this.id = this.route.snapshot.paramMap.get ('id');
    this.nombre = this.route.snapshot.paramMap.get ('nombre');

    this.api.get_tipos_centros_medicos (19).subscribe ((res: any) => {
      this.tipos_centros_medicos = res.tipos_establecimientos;
    });

    if (this.platform.is ('cordova')) {
      this.checkGPSPermission ();
    } else {
      this.getLocationCoordinates ();
    }
  }

  async checkGPSPermission () {
    let loading = await this.loadingController.create ({
      message: 'Procesando...'
    });
    
    await loading.present ();

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      .then ((result: any) => {
        loading.dismiss ();

        if (result.hasPermission) {
          this.askToTurnOnGPS ();
        } else {
          this.requestGPSPermission ();
        }
      },
      err => {
        alert (err);
      }
    );
  }

  async askToTurnOnGPS () {
    let loading = await this.loadingController.create ({
      message: 'Procesando...'
    });
    
    await loading.present ();

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(() => {
        loading.dismiss ();
        this.getLocationCoordinates ();
      }, error => {
        console.log ('Error requesting location permissions ' + JSON.stringify(error))
      });
  }

  async requestGPSPermission () {
    let loading = await this.loadingController.create ({
      message: 'Procesando...'
    });
    
    await loading.present ();

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      loading.dismiss ();
      
      if (canRequest) {
        
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(() => {
            this.askToTurnOnGPS ();
          }, error => {
            console.log ('requestPermission Error requesting location permissions ' + error)
          }
        );
      }
    });
  }

  async getLocationCoordinates () {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.geolocation.getCurrentPosition ().then ().catch ();

    this.geolocation.getCurrentPosition ({enableHighAccuracy: true}).then ((resp: Geoposition) => {
      loading.dismiss ();

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.initMap (resp.coords.latitude, resp.coords.longitude);
      // this.draw_marks ();
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

    this.api.obtener_centros_medicos  (this.latitude, this.longitude, this.id, this.kilometros.toString ()).subscribe ((res: any) => {
      console.log (res);
      // if (this.kilometros === -1 && res.sucursales.length > 0) {
      //   this.kilometros = Math.floor (res.radio_busqueda);
      //   this.map_pan_to (parseFloat (res.sucursales [0].latitud), parseFloat (res.sucursales [0].longitud));
      // }

      this.sucursales = res.sucursales;
      loading.dismiss ();
      this.clear_markers ();
      res.sucursales.forEach ((cliente: any) => {
        let marker: any = new google.maps.Marker ({
          position: new google.maps.LatLng (parseFloat (cliente.latitud), parseFloat (cliente.longitud)),
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
      mapTypeId: 'roadmap',
      styles: [
        {
            "featureType": "administrative.land_parcel",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#f49935"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#fad959"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#a1cdfc"
                },
                {
                    "saturation": 30
                },
                {
                    "lightness": 49
                }
            ]
        }
      ]
    }

    if (this.map === null) {
      this.map = new google.maps.Map (this.mapRef.nativeElement, options);

      google.maps.event.addListener(this.map, 'idle', () => {
        var bounds = this.map.getBounds ();
        var start = bounds.getNorthEast ();
        var end = bounds.getSouthWest ();

        var distStart = google.maps.geometry.spherical.computeDistanceBetween (this.map.getCenter (), start) / 1000.0;
        var distEnd = google.maps.geometry.spherical.computeDistanceBetween (this.map.getCenter (), end) / 1000.0;

        this.latitude = this.map.getCenter ().lat ();
        this.longitude = this.map.getCenter ().lng ();

        console.log ('K', ((distStart + distEnd) / 2));
        this.kilometros = ((distStart + distEnd) / 2);
        if (this.kilometros < 1) {
          this.kilometros = 1;
        }
        this.draw_marks ();
      });
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
      // this.kilometros = 5;
    }

    // this.draw_marks ();
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

        // this.kilometros = 1;
        // this.latitude = place.geometry.location.lat ();
        // this.longitude = place.geometry.location.lng ();

        this.map_pan_to (place.geometry.location.lat (), place.geometry.location.lng ());

        // var bounds = this.map.getBounds ();
        // var start = bounds.getNorthEast ();
        // var end = bounds.getSouthWest ();

        // var distStart = google.maps.geometry.spherical.computeDistanceBetween (this.map.getCenter (), start) / 1000.0;
        // var distEnd = google.maps.geometry.spherical.computeDistanceBetween (this.map.getCenter (), end) / 1000.0;

        // console.log ('K', ((distStart + distEnd) / 2));

        // this.kilometros = distStart;
        // this.draw_marks ();
      });
    });
  }

  map_pan_to (lat: number, lng: number) {
    let location = new google.maps.LatLng (lat, lng);
    this.map.setZoom (17);
    this.map.panTo (location);
  }

  slides_categoria_changed () {
    this.slides.getActiveIndex ().then ((index: number) => {
      console.log (index);
      this.id = this.tipos_centros_medicos [index].id;
      this.draw_marks ();
    });
  }

  get_kilometros (k: number) {
    return Math.floor (k);
  }
}
