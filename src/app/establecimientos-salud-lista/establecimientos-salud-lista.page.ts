import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-establecimientos-salud-lista',
  templateUrl: './establecimientos-salud-lista.page.html',
  styleUrls: ['./establecimientos-salud-lista.page.scss'],
})
export class EstablecimientosSaludListaPage implements OnInit {
  centros_medicos: any [] = [];
  constructor (
    private loadingController: LoadingController,
    private api: ApiService,
    private route: ActivatedRoute,
    private navController: NavController) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.obtener_centros_medicos_lista  (this.route.snapshot.paramMap.get ('ids')).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();

      this.centros_medicos = res.centros_medicos_sucursales;
    }, (error) => {
      console.log('Error getting location', error);
    });
  }

  ver (item: any) {
    this.navController.navigateForward (['perfil-clinica', item.id]);
  }

  back () {
    this.navController.back ();
  }
}
