import { Injectable } from '@angular/core';

// Facebook
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private fb : Facebook, private platform: Platform) {

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

  // fbLogin(): Promise<any> {
    // return this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
  // }
}
