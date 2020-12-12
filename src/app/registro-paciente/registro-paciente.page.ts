import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController, AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/camera/ngx';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpHeaderResponse } from '@angular/common/http';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.page.html',
  styleUrls: ['./registro-paciente.page.scss'],
})
export class RegistroPacientePage implements OnInit {
  form: FormGroup;
  imagen: string = '';
  show_invalid: boolean = false;

  password_type: string = 'password';
  password_icon: string = 'eye';
  
  constructor (
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private storage: Storage,
    private api: ApiService,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private camera: Camera) { }

  ngOnInit () {
    const password = new FormControl ('', Validators.required);
    const confirm_password = new FormControl ('', [Validators.required, CustomValidators.equalTo(password)]);

    this.form = new FormGroup ({
      fName: new FormControl ('', Validators.required),
      lName: new FormControl ('', Validators.required),
      email: new FormControl ('', [Validators.required, Validators.email]),
      imagen: new FormControl (this.imagen),
      password: password,
      confirmar_password: confirm_password 
    });

    console.log (this.form.controls);
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

  go_view (view: string) {
    this.navController.navigateForward ('');
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
        message: 'Procesando...',
      });
  
      await loading.present ();
  
      this.api.registrar_usuario (this.form.value).subscribe ((USUARIO_ACCESS: any) => {
        this.form.reset ();
  
        this.storage.set ('USUARIO_ACCESS', JSON.stringify ({
          access_token: USUARIO_ACCESS.access_token
        }));
        this.api.USUARIO_ACCESS = USUARIO_ACCESS;
  
        loading.message = 'Obteniendo datos del usuario...';
  
        this.api.get_user (USUARIO_ACCESS.access_token).subscribe ((USUARIO_DATA: any) => {
          this.api.USUARIO_DATA = USUARIO_DATA.user;
          this.api.USUARIO_DATA.departamento_id = USUARIO_DATA.departamento_id;
  
          console.log (this.api.USUARIO_DATA);
  
          this.storage.set ('USUARIO_DATA', JSON.stringify (this.api.USUARIO_DATA));
          loading.dismiss ();
  
          this.navController.navigateRoot ('actualizar-residencia');
        }, (error: any) => {
          loading.dismiss ();
          console.log (error);
        }); 
      }, async (error: any) => {
        loading.dismiss ();
        console.log (error);
        console.log (error.error);
  
        let message: string = '';
        if (error.error.errors.email !== undefined && Array.isArray(error.error.errors.email)) {
          error.error.errors.email.forEach ((element: any) => {
            message += element;
          });
        } else {
          message: 'Ingrese los datos correctos';
        }
  
        const alert = await this.alertController.create({
          header: this.api.TITULO_ERROR,
          message: message,
          buttons: ['OK']
        });
    
        await alert.present ();
      });
    }
  }
  
  async selectImageSource () {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Tomar una foto',
        icon: 'camera',
        handler: () => {
          this.takePicture (this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Seleccionar una foto',
        icon: 'images',
        handler: () => {
          this.takePicture (this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }]
    });

    await actionSheet.present();
  }

  async takePicture (sourceType: PictureSourceType) {
    const options: any = {
      quality: 95,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    const loading = await this.loadingController.create({
      message: 'Procesando Informacion ...'
    });

    await loading.present ();

    this.camera.getPicture(options).then ((imageData: any) => {
      loading.dismiss ();
      this.imagen = 'data:image/jpeg;base64,' + imageData;
      this.form.controls ['imagen'].setValue (this.imagen);
    }, (err) => {
      loading.dismiss ();
      console.log ('Camera error', err);
    });
  }
}
