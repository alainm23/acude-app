import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-antecedentes',
  templateUrl: './antecedentes.page.html',
  styleUrls: ['./antecedentes.page.scss'],
})
export class AntecedentesPage implements OnInit {
  data: any;
  form: FormGroup;
  constructor (
      private route: ActivatedRoute,
      private loadingCtrl: LoadingController,
      private navController: NavController,
      private api: ApiService) { }

  ngOnInit() {
    this.data = JSON.parse (this.route.snapshot.paramMap.get ('data'));
    console.log (this.data);

    this.form = new FormGroup ({
      enfermedades: new FormControl (''),
      alergias: new FormControl (''),
      cirugias: new FormControl (''),
      drogas_medicamentos: new FormControl (''),
      fobias: new FormControl (''),
      ansiedad: new FormControl (''),
      panicos: new FormControl (''),
      otros: new FormControl (''),
      altura: new FormControl (''),
      peso: new FormControl (''),
      deportes: new FormControl ('')
    });
  }

  async submit () {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    let data: any = this.form.value;
    data.id_paciente = this.data.id_paciente;
    data.id_cita = this.data.cita_id;

    console.log (data);

    this.api.registrar_antecedentes (data).subscribe ((res:any) => {
      loading.dismiss ();
      console.log (res);
      
      this.data.sucursal_nombre = res.cita.centro_medico_sede_profesional.info_centro_medico_sucursal.denominacion;
      this.data.sucursal_direccion = res.cita.centro_medico_sede_profesional.info_centro_medico_sucursal.direccion;
      this.data.tipo_cita = res.cita.tipo_cita;
      this.data.enlace_sala = res.cita.enlace_sala;
      this.navController.navigateForward (['confirmacion', JSON.stringify (this.data)]);
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  back () {
    this.navController.back ();
  }
}
