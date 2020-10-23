import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-centros-medicos-lista',
  templateUrl: './centros-medicos-lista.page.html',
  styleUrls: ['./centros-medicos-lista.page.scss'],
})
export class CentrosMedicosListaPage implements OnInit {
  especialidades: any [] = [];
  _especialidades: any [] = [];
  search_text: string = '';
  constructor (
    private navController: NavController,
    private api: ApiService,
    public route: ActivatedRoute,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.get_tipos_centros_medicos (19, -1).subscribe ((res: any) => {
      loading.dismiss ();
      this.especialidades = res.tipos_establecimientos;
      this._especialidades = this.especialidades;
      console.log (res);
    });
  }

  back () {
    this.navController.back ();
  }

  encontrar_profesional (item: any) {
    this.navController.navigateForward (['mapa-establecimientos', item.id, item.nombre]);
  }

  filtrar () {
    console.log (this.search_text);
    this.especialidades = this._especialidades;
    if (this.search_text.trim () !== '') {
      this.especialidades = this.especialidades.filter ((item: any) => {
        return item.nombre.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1; 
      });
    }
  }
}
