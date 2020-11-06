import { Component, OnInit , Input} from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-select-especialidad',
  templateUrl: './select-especialidad.page.html',
  styleUrls: ['./select-especialidad.page.scss'],
})
export class SelectEspecialidadPage implements OnInit {
  especialidades: any [] = [];
  _especialidades: any [] = [];
  search_text: string = '';
  @Input () id: string;
  constructor (private api: ApiService, private popoverController: PopoverController) { }

  ngOnInit() {
    console.log (this.id);

    this.api.get_especialidad_by_profesionales (this.id).subscribe ((res: any) => {
      this.especialidades = res.especialidades;
      this._especialidades = this.especialidades;
      console.log (res);
    });
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

  select (item: any) {
    this.popoverController.dismiss (item, 'ok');
  }

  ninguna () {
    this.popoverController.dismiss ({}, 'clear');
  }
}
