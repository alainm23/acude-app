import { Injectable } from '@angular/core';

// Facebook
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import {
  SignInWithApple,
  ASAuthorizationAppleIDRequest,
  AppleSignInResponse,
  AppleSignInErrorResponse
} from "@ionic-native/sign-in-with-apple/ngx";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (
    private clipboard: Clipboard,
    private fb : Facebook,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private api: ApiService,
    private storage: Storage,
    private alertController: AlertController,
    private navController: NavController,
    private loadingController: LoadingController,
    private signInWithApple: SignInWithApple) {

  }

  async facebook () {
    if(this.platform.is ('cordova')) {
      const loading = await this.loadingController.create ({
        message: 'Verificando...',
      });
  
      await loading.present ();

      this.fb.getLoginStatus ().then ((res) => {
        if (res.status === 'connected') {
          this.get_facebook_profile (loading);
        } else {
          this.fb.login (['public_profile']).then ((response: FacebookLoginResponse) => {
            this.get_facebook_profile (loading);
          }).catch((error) => {
            loading.dismiss ();
            console.log (error);
          });
        }
      });
    } else {
      console.log ('No Cordova');
    }
  }

  get_facebook_profile (loading: any) {
    this.fb.api ('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then (async (profile: any) => {
      this.api.login_social ('facebook', profile.email, profile.id.toString (), profile.picture_large.data.url, profile.first_name, profile.last_name).subscribe ((USUARIO_ACCESS: any) => {
        console.log (USUARIO_ACCESS);
        this.storage.set ('USUARIO_ACCESS', JSON.stringify (USUARIO_ACCESS));
        this.api.USUARIO_ACCESS = USUARIO_ACCESS;

        loading.message = 'Obteniendo datos del usuario...';

        this.api.get_user (USUARIO_ACCESS.access_token).subscribe ((USUARIO_DATA: any) => {  
          console.log (USUARIO_DATA)

          this.api.USUARIO_DATA = USUARIO_DATA.user;
          this.api.USUARIO_DATA.departamento_id = USUARIO_DATA.departamento_id;
          this.api.USUARIO_DATA.distrito_id = USUARIO_DATA.distrito_id;
          this.api.USUARIO_DATA.provincia_id = USUARIO_DATA.provincia_id;

          this.storage.set ('USUARIO_DATA', JSON.stringify (this.api.USUARIO_DATA));

          loading.dismiss ();

          if (USUARIO_DATA.departamento_id === 0) {
            this.navController.navigateRoot ('actualizar-residencia');
          } else {
            this.navController.navigateRoot ('home');
          }

          this.api.usuario_changed (this.api.USUARIO_DATA);
        }, (error: any) => {
          loading.dismiss ();
          console.log (error);
        });
      }, error => {
        console.log (error);
        loading.dismiss ();
      });
    });
  }

  is_valid (value: any) {
    let returned = true;
    if (value === '' || value === undefined || value === null) {
      returned = false;
    }

    return returned;
  }

  async google () {
    if (this.platform.is ('cordova')) {
      const loading = await this.loadingController.create ({
        message: 'Verificando...',
      });
  
      await loading.present ();

      this.googlePlus.login ({}).then (async (res: any) => {
        console.log (res);

        this.api.login_social ('gmail', res.email, res.userId, res.imageUrl, res.givenName, res.familyName).subscribe ((USUARIO_ACCESS: any) => {
          console.log (USUARIO_ACCESS);
          
          this.storage.set ('USUARIO_ACCESS', JSON.stringify (USUARIO_ACCESS));
          this.api.USUARIO_ACCESS = USUARIO_ACCESS;

          loading.message = 'Obteniendo datos del usuario...';

          this.api.get_user (USUARIO_ACCESS.access_token).subscribe ((USUARIO_DATA: any) => {
            console.log (USUARIO_DATA)

            this.api.USUARIO_DATA = USUARIO_DATA.user;
            this.api.USUARIO_DATA.departamento_id = USUARIO_DATA.departamento_id;
            this.api.USUARIO_DATA.distrito_id = USUARIO_DATA.distrito_id;
            this.api.USUARIO_DATA.provincia_id = USUARIO_DATA.provincia_id;

            this.storage.set ('USUARIO_DATA', JSON.stringify (this.api.USUARIO_DATA));
            loading.dismiss ();

            if (USUARIO_DATA.departamento_id === 0) {
              this.navController.navigateRoot ('actualizar-residencia');
            } else {
              this.navController.navigateRoot ('home');
            }

            this.api.usuario_changed (this.api.USUARIO_DATA);
          }, (error: any) => {
            loading.dismiss ();
            console.log (error);
          });
        }, error => {
          console.log (error);
          loading.dismiss ();
        });
      })
      .catch(err => {
        console.error(err);
        loading.dismiss ();
      });
    } else {
      console.log ('No Cordova');
    }
  }

  apple () {
    this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
    .then (async (res: AppleSignInResponse) => {
      const loading = await this.loadingController.create ({
        message: 'Verificando...',
      });
  
      await loading.present ();

      this.api.login_social ('gmail', res.email, res.user, '', res.fullName.givenName, res.fullName.familyName).subscribe ((USUARIO_ACCESS: any) => {
        console.log (USUARIO_ACCESS);
        
        this.storage.set ('USUARIO_ACCESS', JSON.stringify (USUARIO_ACCESS));
        this.api.USUARIO_ACCESS = USUARIO_ACCESS;

        loading.message = 'Obteniendo datos del usuario...';

        this.api.get_user (USUARIO_ACCESS.access_token).subscribe ((USUARIO_DATA: any) => {
          console.log (USUARIO_DATA)

          this.api.USUARIO_DATA = USUARIO_DATA.user;
          this.api.USUARIO_DATA.departamento_id = USUARIO_DATA.departamento_id;
          this.api.USUARIO_DATA.distrito_id = USUARIO_DATA.distrito_id;
          this.api.USUARIO_DATA.provincia_id = USUARIO_DATA.provincia_id;

          this.storage.set ('USUARIO_DATA', JSON.stringify (this.api.USUARIO_DATA));
          loading.dismiss ();

          if (USUARIO_DATA.departamento_id === 0) {
            this.navController.navigateRoot ('actualizar-residencia');
          } else {
            this.navController.navigateRoot ('home');
          }

          this.api.usuario_changed (this.api.USUARIO_DATA);
        }, (error: any) => {
          loading.dismiss ();
          console.log (error);
        });
      }, error => {
        console.log (error);
        loading.dismiss ();
      });
    })
    .catch((error: AppleSignInErrorResponse) => {
      console.error(error);
    });
  }
}
