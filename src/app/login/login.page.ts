import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  imagen: any;
  constructor (
    private navController: NavController,
    private loadingController: LoadingController,
    private storage: Storage,
    private auth: AuthService,
    private api: ApiService) { }

  ngOnInit () {
    this.form = new FormGroup ({
      email: new FormControl ('appmedico@gmail.com', [Validators.required, Validators.email]),
      password: new FormControl ('secret2020', Validators.required)
    });
  }

  go_view (view: string) {
    this.navController.navigateForward (view);
  }

  facebook () {
    this.auth.facebook ();
  }

  async submit () {
    const loading = await this.loadingController.create({
      message: 'Verificando...',
    });

    await loading.present ();

    this.api.login (this.form.value.email, this.form.value.password).subscribe ((USUARIO_ACCESS: any) => {
      this.storage.set ('USUARIO_ACCESS', JSON.stringify (USUARIO_ACCESS));
      this.api.USUARIO_ACCESS = USUARIO_ACCESS;

      loading.message = 'Obteniendo datos del usuario...';

      this.api.get_user (USUARIO_ACCESS.access_token).subscribe ((USUARIO_DATA: any) => {  
        this.api.USUARIO_DATA = USUARIO_DATA.user;
        this.api.USUARIO_DATA.departamento_id = USUARIO_DATA.departamento_id;

        this.storage.set ('USUARIO_DATA', JSON.stringify (this.api.USUARIO_DATA));
        loading.dismiss ();

        if (USUARIO_DATA.departamento_id === 0) {
          this.navController.navigateRoot ('actualizar-residencia');
        } else {
          this.navController.navigateRoot ('home');
        }
      }, (error: any) => {
        loading.dismiss ();
        console.log (error);
      }); 
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }
}
