import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
declare var google: any;
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  checked: boolean = false;
  is_ios: boolean = false;

  paises: any [] = [];
  pais: any;
  directionsService: any = new google.maps.DirectionsService ();
  geocoder: any = new google.maps.Geocoder ();
  constructor (
    private navController: NavController,
    private loadingController: LoadingController,
    private storage: Storage,
    private auth: AuthService,
    private toastController: ToastController,
    private api: ApiService,
    private platform: Platform,
    private locationAccuracy: LocationAccuracy,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private alertController: AlertController) { }

  ngOnInit () {
    this.is_ios = this.platform.is ('ios');

    this.api.listado_paises ().subscribe ((res: any) => {
      this.paises = res.paises;
      console.log (res.paises);
      if (this.platform.is ('cordova')) {
        this.checkGPSPermission ();
      } else {
        this.getLocationCoordinates ();
      }
    });
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
        loading.dismiss ();
        alert (err);
      }
    );
  }

  async askToTurnOnGPS () {
    let loading = await this.loadingController.create ({
      message: 'Procesando...'
    });
    
    await loading.present ();

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
      loading.dismiss ();
      this.getLocationCoordinates ();
    }, error => {
      loading.dismiss ();
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
    }, error => {
      loading.dismiss ();
    });
  }

  async getLocationCoordinates () {
    const loading = await this.loadingController.create({
      message: 'Procesando...'
    });

    await loading.present ();

    this.geolocation.getCurrentPosition ().then ().catch ();
    this.geolocation.getCurrentPosition ({enableHighAccuracy: true, timeout: 60*1000}).then ((resp: Geoposition) => {
      console.log (resp.coords.latitude);
      console.log (resp.coords.longitude);

      let location = new google.maps.LatLng (
        resp.coords.latitude,
        resp.coords.longitude
      );

      let request = {
        origin: location,
        destination: location,
        travelMode: google.maps.TravelMode.WALKING
      };

      this.directionsService.route (request, (result: any, status: any) => {
        if (status == google.maps.DirectionsStatus.OK) {
          console.log (result);
          this.geocoder.geocode ({'placeId': result.geocoded_waypoints [0].place_id}, (results: any, status: any) => {
            console.log (results);
            if (status == google.maps.GeocoderStatus.OK) {
              loading.dismiss ();
              this.validar_pais (results [0].address_components)
            } else {
              this.presentAlertRadio ();
              loading.dismiss ();
            }
          });
        } else {
          loading.dismiss ();
          this.presentAlertRadio ();
        }
      });
    }).catch ((error: any) => {
      loading.dismiss ();
      console.log (error);
      this.presentAlertRadio ();
    });
  }

  go_view (view: string) {
    this.navController.navigateForward (view);
  }

  async login_social (social: string) {
    if (this.checked) {
      if (social === 'correo') {
          this.go_view ('registro-paciente');
      } else if (social === 'facebook') {
        this.auth.facebook ();
      } else if (social === 'google') {
        this.auth.google ();
      } else if (social === 'apple') {
        this.auth.apple ();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Es necesario que acepte los Términos y Condiciones antes de continuar',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });

      toast.present ();
    }
  }

  go_link (type: string) {
    console.log(this.pais);
    if (type === 'terminos') {
      window.open ('https://www.acudeapp.com/storage/' + this.pais.pdf_terminos_usuario, '_system');
    } else {
      window.open ('https://www.acudeapp.com/storage/' + this.pais.pdf_politicas_usuario, '_system');
    }
  }

  validar_pais (address_components: any []) {
    console.log (address_components);
    let corrent_coutry = null;
    let code_country = null;
    
    address_components.forEach ((e: any) => {
      if (e.types.includes ("country")) {
        corrent_coutry = e.long_name;
        code_country = e.short_name;
      }
    });

    console.log (corrent_coutry);
    console.log (code_country);

    if (corrent_coutry !== null) {
      const pais = this.paises.find ((x => x.iniciales_pais === code_country));
      if (pais !== undefined) {
        this.pais = pais;
        this.storage.set ('PAIS', JSON.stringify (pais));
        this.api.PAIS = pais;
        console.log (this.api.PAIS);
      } else {
        this.navController.navigateRoot (['estamos-trabajando']);
      }
    } else {
      this.presentAlertRadio ();
    }
  }

  async presentAlertRadio () {
    let inputs: any [] = [];
    this.paises.forEach ((pais: any) => {
      inputs.push ({
        name: pais.id,
        type: 'radio',
        label: pais.nombre,
        value: pais,
      });
    });

    const alert = await this.alertController.create ({
      header: 'Seleccione un pais',
      message: 'Seleccione el pais donde se encuentra',
      backdropDismiss: false,
      inputs: inputs,
      buttons: [{
          text: 'Confirmar',
          handler: (data: any) => {
            this.pais = data;
            this.storage.set ('PAIS', JSON.stringify (data));
            this.api.PAIS = data;
          }
        }, {
          text: 'No encuentro mi pais',
          handler: () => {
            this.navController.navigateRoot (['zdo']);
          }
        }
      ]
    });

    await alert.present ();
  }
}
