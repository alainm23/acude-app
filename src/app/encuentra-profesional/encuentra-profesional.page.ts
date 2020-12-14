import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
declare var google: any;

// Geo
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { strict } from 'assert';
import { Storage } from '@ionic/storage';

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
  zona: string = 'tu zona';

  kilometros: number = 10;
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
    private locationAccuracy: LocationAccuracy,
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private storage: Storage,
    private route: ActivatedRoute) {}

  async ngOnInit () {
    this.nombre = this.route.snapshot.paramMap.get ('nombre');

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

    let DEPARTAMENTO_SELECCIONADO = await this.storage.get ('DEPARTAMENTO_SELECCIONADO');
    if (DEPARTAMENTO_SELECCIONADO === null) {
      this.geolocation.getCurrentPosition ().then ().catch ();
      this.geolocation.getCurrentPosition ({enableHighAccuracy: true}).then ((resp: Geoposition) => {
        loading.dismiss ();

        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;

        this.initMap (resp.coords.latitude, resp.coords.longitude);
        this.draw_marks ();
        this.initAutocomplete ();
      }).catch ((error) => {
        loading.dismiss ();  
        console.log ('Error getting location', error);
      });
    } else {
      if (DEPARTAMENTO_SELECCIONADO === this.api.USUARIO_DATA.departamento_id) {
        this.geolocation.getCurrentPosition ().then ().catch ();
        this.geolocation.getCurrentPosition ({enableHighAccuracy: true}).then ((resp: Geoposition) => {
          loading.dismiss ();

          this.latitude = resp.coords.latitude;
          this.longitude = resp.coords.longitude;

          this.initMap (resp.coords.latitude, resp.coords.longitude);
          this.draw_marks ();
          this.initAutocomplete ();
        }).catch ((error) => {
          loading.dismiss ();  
          console.log ('Error getting location', error);
        });
      } else {
        let DEPARTAMENTO_SELECCIONADO_DATA = JSON.parse (await this.storage.get ('DEPARTAMENTO_SELECCIONADO_DATA'));

        loading.dismiss ();

        this.latitude = parseFloat (DEPARTAMENTO_SELECCIONADO_DATA.latitud);
        this.longitude = parseFloat (DEPARTAMENTO_SELECCIONADO_DATA.longitud);
        this.zona = DEPARTAMENTO_SELECCIONADO_DATA.nombre;

        this.initMap (this.latitude, this.longitude);
        this.draw_marks ();
        this.initAutocomplete ();
      }
    }
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

    this.api.obtener_profesionales_ubicacion ('especialidad', this.route.snapshot.paramMap.get ('id'), this.latitude, this.longitude, this.kilometros).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();

      this.clear_markers ();

      this.consultorios = res.profesionales;
      res.profesionales.forEach((cliente: any) => {
        let marker: any = new google.maps.Marker ({
          position: new google.maps.LatLng (parseFloat (cliente.latitud) , parseFloat (cliente.longitud)),
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

    if (this.consultorios.length >= 10) {
      // this.kilometros = this.kilometros-value;
    }

    this.draw_marks ();
  }

  ver_lista () {
    let string_cm: string = this.consultorios.map((elem: any) => {
      return elem.id_sucursal;
    }).join (",");
    if (string_cm === '') {
      string_cm = 'null';
    }

    console.log (string_cm);

    this.navController.navigateForward (['encuentra-profesional-lista', string_cm, this.nombre]);  
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

  get_kilometros (k: number) {
    return Math.floor (k);
  }
}
