import { Injectable } from '@angular/core';

// Services
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor (private androidPermissions: AndroidPermissions,
    private platform: Platform) {

  }

  async checkCameraPermission (): Promise<boolean> {
    return await new Promise ((resolve, reject) => {
        if (this.platform.is ('cordova')) {
            this.androidPermissions.checkPermission (this.androidPermissions.PERMISSION.CAMERA).then(
                result => {
                    if (result.hasPermission) {
                        resolve (true);
                    } else {
                        resolve (false);
                    }
                },
                err => {alert(err);}
            );}
        else {resolve (true); }
    })
  }
  
  async checkAudioPermission (): Promise<boolean> {
    return await new Promise ((resolve, reject) => {
        if (this.platform.is ('cordova')) {
            this.androidPermissions.checkPermission (this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
                result => {
                    if (result.hasPermission) {
                        resolve (true);
                    } else {
                        resolve (false);
                    }
                },
                err => {alert(err);}
            );}
        else {resolve (true); }
    })
  }

  async requestCameraAudioPermission (): Promise<string> {
    return await new Promise((resolve, reject) => {
        // Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermissions ([
          this.androidPermissions.PERMISSION.CAMERA,
          this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
          this.androidPermissions.PERMISSION.RECORD_AUDIO
        ]).then((result) => {
          if (result.hasPermission) {
            resolve ('GOT_PERMISSION');
          } else {
            resolve ('DENIED_PERMISSION');
          }
        },error => {
          // Show alert if user click on 'No Thanks'
          alert('requestCameraPermission ' + error);
        });
    });
  }
}
