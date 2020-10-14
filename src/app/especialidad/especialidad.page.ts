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

    this.api.get_especialidad_by_profesionales (this.route.snapshot.paramMap.get ('id')).subscribe ((res: any) => {
      loading.dismiss ();
      
      Object.entries(res.especialidades).forEach ((val: any) => {
        this.especialidades.push ({
          id: val [0],
          nombre: val [1]
        });
      });
      
      this._especialidades = this.especialidades;
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
