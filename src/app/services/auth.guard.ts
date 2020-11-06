import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// Services
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (
    private storage: Storage,
    private api: ApiService,
    private navController: NavController){}
  canActivate () {
    return this.storage.get ('USUARIO_ACCESS').then (async (user: any) => {
      if (user !== null) {
        this.api.USUARIO_ACCESS = JSON.parse (user);
        this.api.USUARIO_DATA = JSON.parse (await this.storage.get ('USUARIO_DATA'));

        console.log (this.api.USUARIO_DATA);

        if (this.api.USUARIO_DATA.departamento_id === 0) {
          this.navController.navigateRoot ('actualizar-residencia');
          return false;
        }

        return true;
      } else {
        this.navController.navigateRoot ('onboarding');
        return false;
      }
    });
  }
}
