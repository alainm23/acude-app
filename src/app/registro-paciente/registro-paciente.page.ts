import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/camera/ngx';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.page.html',
  styleUrls: ['./registro-paciente.page.scss'],
})
export class RegistroPacientePage implements OnInit {
  form: FormGroup;
  imagen: string = '';
  constructor (
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private storage: Storage,
    private api: ApiService,
    private actionSheetController: ActionSheetController,
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
  }

  go_view (view: string) {
    this.navController.navigateForward ('');
  }

  async submit () {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });

    await loading.present ();

    this.api.registrar_usuario (this.form.value).subscribe ((USUARIO_ACCESS: any) => {
      console.log (USUARIO_ACCESS);
      this.form.reset ();

      this.storage.set ('USUARIO_ACCESS', JSON.stringify ({
        access_token: USUARIO_ACCESS.access_token
      }));
      this.api.USUARIO_ACCESS = USUARIO_ACCESS;

      loading.message = 'Obteniendo datos del usuario...';

      this.api.get_user (USUARIO_ACCESS.access_token).subscribe ((USUARIO_DATA: any) => {
        this.api.USUARIO_DATA = USUARIO_DATA.user;
        this.api.USUARIO_DATA.departamento_id = USUARIO_DATA.departamento_id;

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

      const alert = await this.alertController.create({
        header: '¡Upps!',
        message: 'Ingrese algun dato correcto',
        buttons: ['OK']
      });
  
      await alert.present();
    });
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
