import { Component, OnInit } from '@angular/core';

// Services
import { NavController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.page.html',
  styleUrls: ['./especialidad.page.scss'],
})
export class EspecialidadPage implements OnInit {
  especialidades: any [] = [];
  _especialidades: any [] = [];
  search_text: string = '';
  especialidad_nombre: string = '';
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

    this.especialidad_nombre = this.route.snapshot.paramMap.get ('nombre');
    this.api.get_especialidad_by_profesionales (this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      loading.dismiss ();
      this.especialidades = res.especialidades;
      this._especialidades = this.especialidades;
      console.log (res);
    });
  }

  back () {
    this.navController.back ();
  }

  encontrar_profesional (item: any) {
    this.navController.navigateForward (['encuentra-profesional', item.id, item.nombre]);
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
