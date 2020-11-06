import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements OnInit {
  form: FormGroup;
  constructor (
    private navController: NavController,
    private loadingController: LoadingController,
    private storage: Storage,
    private auth: AuthService,
    private alertController: AlertController,
    private api: ApiService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', Validators.required)
    });
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
      }, (error: any) => {
        loading.dismiss ();
        console.log (error);
      }); 
    }, async error => {
      this.form.reset ();

      loading.dismiss ();
      // console.log (error);

      // let message: string = '';
      // if (error.error.errors.email !== undefined && Array.isArray(error.error.errors.email)) {
      //   error.error.errors.email.forEach ((element: any) => {
      //     message += element;
      //   });
      // } else {
      //   message: 'Ingrese los datos correctos';
      // }

      const alert = await this.alertController.create({
        header: this.api.TITULO_ERROR,
        message: 'Los datos de acceso no corresponden a ningun usuario',
        buttons: ['OK']
      });
  
      await alert.present ();
    });
  }
}
