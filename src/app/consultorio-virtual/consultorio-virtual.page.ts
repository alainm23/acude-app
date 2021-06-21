import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

// Services
declare var SynoLiveAPI: any;
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PermissionsService } from '../services/permissions.service'

@Component({
  selector: 'app-consultorio-virtual',
  templateUrl: './consultorio-virtual.page.html',
  styleUrls: ['./consultorio-virtual.page.scss'],
})
export class ConsultorioVirtualPage implements OnInit {
  @ViewChild ('syno', {static: true})  syno: ElementRef;

  id: string;
  nombre_paciente: string;

  constructor (private route: ActivatedRoute,
    private auth: AuthService,
    private permission: PermissionsService,
    private platform: Platform,
    private alertController: AlertController,
    private navController: NavController) { }

  async ngOnInit () {
    this.id = this.route.snapshot.paramMap.get ('id');
    this.nombre_paciente = this.route.snapshot.paramMap.get ('nombre_paciente');

    console.log (this.id);

    if (!this.platform.is ('cordova')) {
      return this.init_syno ();
    }

    const has_camera_permission = await this.permission.checkCameraPermission ();
    const has_audio_permission = await this.permission.checkAudioPermission ();

    if (has_camera_permission === false || has_audio_permission === false) {
      await this.permission.requestCameraAudioPermission ();
    }

    this.init_syno ();
  }

  init_syno () {
    setTimeout (() => {
      const options = {
        roomName: this.id,
        width: '100%',
        height: '100%',
        parentNode: this.syno.nativeElement,
        userInfo: {
          email: 'email@syno.live',
          displayName: this.nombre_paciente
        }
      };
  
      const api = new SynoLiveAPI (options);

      console.log ('Termino de cargar');
    }, 1000);
  }

  async confirm () {
    const alert = await this.alertController.create ({
      header: 'Confirmar operación',
      message: '¿Esta seguro que desea salir del consultorio virtual?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Confirmar',
          handler: () => {
            this.navController.back ();
          }
        }
      ]
    });

    await alert.present();
  }
}
