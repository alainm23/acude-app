import { Component, OnInit } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-actualizar-residencia',
  templateUrl: './actualizar-residencia.page.html',
  styleUrls: ['./actualizar-residencia.page.scss'],
})
export class ActualizarResidenciaPage implements OnInit {
  departamentos: any [] = [];
  provincias: any [] = [];
  distritos: any [] = [];

  departamento: any = null;
  provincia: any = null;
  distrito: any = null;

  constructor (
    private api: ApiService, 
    private loadingController: LoadingController,
    private navController: NavController,
    private storage: Storage) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_departamentos ().subscribe ((res: any) => {
      loading.dismiss ();

      Object.entries (res.departamentos).forEach ((val: any) => {
        this.departamentos.push ({
          id: val [0],
          nombre: val [1]
        })
      });
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  async departamentoChange () {
    this.provincia = null;
    this.distrito =  null;

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_provincias (this.departamento.id).subscribe ((res: any) => {
      loading.dismiss ();

      Object.entries(res.provincias).forEach ((val: any) => {
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
    this.distrito =  null;

    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    if (this.provincia !== null) {
      this.api.get_distritos (this.provincia.id).subscribe ((res: any) => {
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

  async submit () {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.actualizar_distrito_usuario (this.distrito.id).subscribe (async (res: any) => {
      loading.dismiss ();
      this.navController.navigateRoot ('home');

      let USUARIO_DATA = JSON.parse (await this.storage.get ('USUARIO_DATA'));
      USUARIO_DATA.departamento_id = this.departamento.id;
      USUARIO_DATA.departamento_nombre = this.departamento.nombre;
      this.storage.set ('USUARIO_DATA', JSON.stringify (USUARIO_DATA));
      this.api.USUARIO_DATA = USUARIO_DATA;
    }, (error: any) => {
      loading.dismiss ();
      console.log (error);
    });
  }
}
