import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
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
  show_invalid: boolean = false;

  password_type: string = 'password';
  password_icon: string = 'eye';
  constructor (
    private navController: NavController,
    private loadingController: LoadingController,
    private storage: Storage,
    private auth: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private api: ApiService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', Validators.required)
    });
  }

  ver_password () {
    if (this.password_type === 'password') {
      this.password_type = 'text';
      this.password_icon = 'eye-off';
    } else {
      this.password_type = 'password';
      this.password_icon = 'eye';
    }
  }

  async submit () {
    if (this.form.invalid) {
      const toast = await this.toastController.create ({
        message: 'Complete todos los campos correctamente',
        duration: 2000,
        position: 'top'
      });
      toast.present ();

      this.show_invalid = true;
    } else {
      const loading = await this.loadingController.create({
        message: 'Verificando...',
      });
  
      await loading.present ();
  
      this.api.login (this.form.value.email.trim (), this.form.value.password.trim ()).subscribe ((USUARIO_ACCESS: any) => {
        console.log ('USUARIO_ACCESS', USUARIO_ACCESS);

        this.storage.set ('USUARIO_ACCESS', JSON.stringify (USUARIO_ACCESS));
        this.api.USUARIO_ACCESS = USUARIO_ACCESS;
  
        loading.message = 'Obteniendo datos del usuario...';
  
        this.api.get_user (USUARIO_ACCESS.access_token).subscribe ((USUARIO_DATA: any) => {  
          console.log ('USUARIO_DATA', USUARIO_DATA);
  
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
        console.log (error);
        this.form.controls ['password'].setValue ('');
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
          message: error.error.message,
          buttons: ['OK']
        });
    
        await alert.present ();
      });
    }
  }

  async emial_alert () {
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      message: 'Ingrese el correo electrónico con el que te registraste en la plataforma',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Confirmar',
          handler: (data: any) => {
            if (data.email.trim () != "") {
              this.validar_olvido_correo (data.email.trim ());
            } else {
              this.alert_message ('Ingrese un correo valido');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async validar_olvido_correo (email: string) {
    const loading = await this.loadingController.create({
      message: 'Verificando...',
    });

    await loading.present ();

    this.api.recuperar_password (email).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();
      this.alert_message ('Acabamos de enviarte un email a <b>' + email +'</b> con los pasos necesarios para restablezcas tu contraseña. (Revisa también tu bandeja de no deseado)');
    }, error => {
      loading.dismiss ();
      console.log (error);
      this.alert_message ('Lo sentimos el correo ingresado no esta registrado en el sistema.');
    })
  }

  async alert_message (message: string) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }
}
