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
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  departamentos: any [] = [];
  provincias: any [] = [];
  distritos: any [] = [];

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

  async ngOnInit () {
    this.imagen = 'https://acudeapp.com/storage/' + this.api.USUARIO_DATA.imagen;

    const password = new FormControl ('', Validators.required);
    const confirm_password = new FormControl ('', [Validators.required, CustomValidators.equalTo(password)]);

    this.form = new FormGroup ({
      fName: new FormControl (this.api.USUARIO_DATA.first_name, Validators.required),
      lName: new FormControl (this.api.USUARIO_DATA.last_name, Validators.required),
      imagen: new FormControl (''),
      departamento: new FormControl ()
    });

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_departamentos ().subscribe ((res: any) => {
      loading.dismiss ();
      this.departamentos = res.departamentos;
      this.departamentos.forEach ((d: any) => {
        if (d.id === this.api.USUARIO_DATA.departamento_id) {
          this.form.controls ['departamento'].setValue (d);
          this.form.updateValueAndValidity ();
        }
      });
    }, error => {
      loading.dismiss ();
      console.log (error);
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

    this.api.actualizar_usuario (this.form.value).subscribe ((USUARIO_ACCESS: any) => {
      console.log (USUARIO_ACCESS);
      this.storage.set ('USUARIO_ACCESS', JSON.stringify ({
        access_token: USUARIO_ACCESS.access_token
      }));
      this.api.USUARIO_ACCESS = USUARIO_ACCESS;

      this.api.actualizar_distrito_usuario (this.form.value.departamento.id).subscribe (async (res: any) => {
        loading.message = 'Obteniendo datos del usuario...';
        this.api.get_user (USUARIO_ACCESS.access_token).subscribe (async (_: any) => {
          // this.api.USUARIO_DATA = USUARIO_DATA.user;
          // this.api.USUARIO_DATA.departamento_id = USUARIO_DATA.departamento_id;

          // this.storage.set ('USUARIO_DATA', JSON.stringify (this.api.USUARIO_DATA));
          // loading.dismiss ();

          // this.navController.navigateRoot ('home');

          loading.dismiss ();
          this.navController.navigateRoot ('home');
    
          let USUARIO_DATA = JSON.parse (await this.storage.get ('USUARIO_DATA'));
          USUARIO_DATA.departamento_id = this.form.value.departamento.id;
          USUARIO_DATA.departamento_nombre = this.form.value.departamento.nombre;
          this.storage.set ('USUARIO_DATA', JSON.stringify (USUARIO_DATA));
          this.api.USUARIO_DATA = USUARIO_DATA;

          this.form.reset ();
        }, (error: any) => {
          loading.dismiss ();
          console.log (error);
        }); 
      }, (error: any) => {
        loading.dismiss ();
        console.log (error);
      });
    }, error => {
      console.log (error);
      loading.dismiss ();
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

  async departamentoChange () {
    // this.form.controls ['provincia'].setValue (null);
    // this.form.controls ['distrito'].setValue (null);

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_provincias (this.form.value.departamento.id).subscribe ((res: any) => {
      console.log (res);

      loading.dismiss ();

      Object.entries (res.provincias).forEach ((val: any) => {
        this.provincias.push ({
          id: val [0],
          nombre: val [1]
        })
      });
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  async provinciaChange () {
    // this.form.controls ['distrito'].setValue (null);

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    if (this.form.value.provincia !== null) {
      this.api.get_distritos (this.form.value.provincia.id).subscribe ((res: any) => {
        loading.dismiss ();
  
        Object.entries(res.distritos).forEach ((val: any) => {
          this.distritos.push ({
            id: val [0],
            nombre: val [1]
          })
        });
      }, error => {
        loading.dismiss ();
        console.log (error);
      });
    } else {
      loading.dismiss ();
    }
  }
}
