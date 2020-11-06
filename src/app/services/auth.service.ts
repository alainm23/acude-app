import { Injectable } from '@angular/core';

// Facebook
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private fb : Facebook, private platform: Platform, private googlePlus: GooglePlus) {

  }

  facebook () {
    if(this.platform.is ('cordova')) {
      this.fb.login(['email'])
      .then ((response:FacebookLoginResponse) => {
        this.loginWithFacebook (response.authResponse.accessToken);
      }).catch((error) => {
        alert('error:' + JSON.stringify(error))
      });
    } else {
      console.log ('No Cordova');
    }
  }

  loginWithFacebook(accessToken: any) {
    alert (accessToken);
    // const credential = firebase.auth.FacebookAuthProvider
    //     .credential(accessToken);
    // return this.fireAuth.auth.signInWithCredential (credential)
  }

  google () {
    if(this.platform.is ('cordova')) {
      this.googlePlus.login({})
      .then(res => {
        console.log(res)
        alert (res);
      })
      .catch(err => {
        console.error(err)
        alert (err);
      });
    } else {
      console.log ('No Cordova');
    }
  }
}
