import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  checked: boolean = false;
  constructor (
    private navController: NavController,
    private loadingController: LoadingController,
    private storage: Storage,
    private auth: AuthService,
    public toastController: ToastController,
    private api: ApiService) { }

  ngOnInit () {
    
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

  go_link (link: string) {
    window.open (link, '_system');
  }
}
