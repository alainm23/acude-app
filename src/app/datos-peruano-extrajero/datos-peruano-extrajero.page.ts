import { Component, OnInit } from '@angular/core';

// Services
import { ApiService } from '../services/api.service';
import { LoadingController, NavController, AlertController } from '@ionic/angular';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-datos-peruano-extrajero',
  templateUrl: './datos-peruano-extrajero.page.html',
  styleUrls: ['./datos-peruano-extrajero.page.scss'],
})
export class DatosPeruanoExtrajeroPage implements OnInit {
  pacientes: any [] = [];
  es_extranjero: boolean = false;
  form: FormGroup;
  paciente_seleccionado: any = 'me';
  data: any;
  datetime: any;
  dni_valido: boolean = false;
  readonly: boolean = false;

  tiene_api: string = '0';
  constructor (private api: ApiService,
      private loadingCtrl: LoadingController,
      private navController: NavController,
      private alertController: AlertController,
      private route: ActivatedRoute) { }

  async ngOnInit () {
    this.tiene_api = this.api.PAIS.tipo_registro;
    this.data = JSON.parse (this.route.snapshot.paramMap.get ('data'));

    this.datetime = moment (this.data.fecha).set ('hour', parseInt (this.data.hora.split (':') [0])).set ('minute', parseInt (this.data.hora.split (':') [1]));
    
    this.form = new FormGroup ({
      dni: new FormControl ('', [Validators.required]),
      nombres: new FormControl ('', Validators.required),
      apellidos: new FormControl ('', Validators.required),
      fecha_nacimiento: new FormControl ('', [Validators.required]),
      sexo: new FormControl ('', [Validators.required]),
      tipo_paciente: new FormControl ('', [Validators.required]),
      telefono: new FormControl (''),
      correo: new FormControl ('', [Validators.email, Validators.required]),
      uno_mismo: new FormControl (0),
    });

    if (this.api.PAIS.tipo_documento === '0') {
      this.form.controls ['dni'].setValidators ([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength (this.api.PAIS.nro_caract_max_doc),
        Validators.minLength (this.api.PAIS.nro_caract_min_doc)
      ]);
    } else {
      this.form.controls ['dni'].setValidators ([
        Validators.required,
        Validators.maxLength (this.api.PAIS.nro_caract_max_doc),
        Validators.minLength (this.api.PAIS.nro_caract_min_doc)
      ]);
    }

    this.form.updateValueAndValidity ();

    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    this.api.relacionados_pacientes ().subscribe ((res: any) => {
      console.log ('res', res);
      this.pacientes = res.pacientes;
      if (this.pacientes.length <= 0) {
        this.paciente_seleccionado = 'me';
        this.change_paciente ('me');
      } else {
        this.paciente_seleccionado = this.pacientes [0];
      }

      loading.dismiss ();
    }, error => {
      console.log (error)
      loading.dismiss ();;
    });
  }

  async submit () {
    console.log (this.form);

    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    let data = this.form.value;
    data.sexo = parseInt (data.sexo)
    data.tipo_paciente = parseInt (data.tipo_paciente);
    data.id_user = this.api.USUARIO_DATA.id;

    if (this.paciente_seleccionado === 'nuevo') {
      data.fecha_nacimiento = data.fecha_nacimiento.substring (0, 10);
      data.uno_mismo = 0;

      this.api.registrar_paciente (data).subscribe ((res: any) => {
        loading.dismiss ();
        this.data.id_paciente = res.paciente.id;
        this.data.nombre_paciente = res.paciente.nombres + ' ' + res.paciente.apellidos
        this.navController.navigateForward (['antecedentes', JSON.stringify (this.data)]);
      }, error => {
        loading.dismiss ();
        console.log (error);
      });
      console.log (data);
    } else if (this.paciente_seleccionado === 'me') {
      data.fecha_nacimiento = data.fecha_nacimiento.substring (0, 10);
      data.uno_mismo = 1;

      this.api.registrar_paciente (data).subscribe ((res: any) => {
        loading.dismiss ();
        this.data.id_paciente = res.paciente.id;
        this.data.nombre_paciente = res.paciente.nombres + ' ' + res.paciente.apellidos
        this.navController.navigateForward (['antecedentes', JSON.stringify (this.data)]);
      }, error => {
        loading.dismiss ();
        console.log (error);
      });

      console.log (data);
    } else {
      loading.dismiss ();
      this.data.id_paciente = this.paciente_seleccionado.id;
      this.data.nombre_paciente = this.paciente_seleccionado.nombres + ' ' + this.paciente_seleccionado.apellidos;
      this.navController.navigateForward (['antecedentes', JSON.stringify (this.data)]);
    }
  }

  validar_existe_me () {
    var returned: boolean = true;

    this.pacientes.forEach ((p: any) => {
      if (p.paciente.uno_mismo === "1") {
        returned = false; 
      }
    });

    return returned;
  }

  change_paciente (event: any) {
    if (event === 'me') {
      this.form.controls ['dni'].setValue (null);
      this.form.controls ['nombres'].setValue (this.api.USUARIO_DATA.first_name);
      this.form.controls ['apellidos'].setValue (this.api.USUARIO_DATA.last_name);
      this.form.controls ['fecha_nacimiento'].setValue (this.api.USUARIO_DATA.fecha_nacimiento);
      this.form.controls ['sexo'].setValue (this.api.USUARIO_DATA.sexo);
      this.form.controls ['tipo_paciente'].setValue (0);
      this.form.controls ['telefono'].setValue (this.api.USUARIO_DATA.telefono);
      this.form.controls ['correo'].setValue (this.api.USUARIO_DATA.email);
      this.form.controls ['uno_mismo'].setValue (1);
    } else {
      this.form.reset ();
      this.form.controls ['dni'].enable ();
      this.form.controls ['nombres'].enable ();
      this.form.controls ['apellidos'].enable ();
      this.dni_valido = false;
      this.readonly = false;
    } 
  }

  change_value (event: any) {
    this.form.reset ();
    this.form.controls ['dni'].enable ();
    this.form.controls ['nombres'].enable ();
    this.form.controls ['apellidos'].enable ();
    this.dni_valido = false;
    this.readonly = false;

    if (this.es_extranjero) {
      this.form.controls ['dni'].setValidators ([
        Validators.required
      ]);
    } else {
      if (this.api.PAIS.tipo_documento === '0') {
        this.form.controls ['dni'].setValidators ([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength (this.api.PAIS.nro_caract_max_doc),
          Validators.minLength (this.api.PAIS.nro_caract_min_doc)
        ]);
      } else {
        this.form.controls ['dni'].setValidators ([
          Validators.required,
          Validators.maxLength (this.api.PAIS.nro_caract_max_doc),
          Validators.minLength (this.api.PAIS.nro_caract_min_doc)
        ]);
      }
    }

    this.form.updateValueAndValidity ();
  }

  get_tipo_paciente_string (value: string) {
    if (value === "0") {
      return "DNI:"
    } else if (value === "1") {
      return "PASAPORTE:";
    } else {
      return "C.E.:";
    }
  }

  disabled_form () {
    let returned: boolean = true;
    if (this.paciente_seleccionado === null) {
      returned = true;
    } else if (this.paciente_seleccionado === 'nuevo') {
      returned = this.form.invalid;
    } else {
      returned = false;
    }

    return returned;
  }

  disabled_dni_form () {
    let returned: boolean = true;

    if (this.dni_valido) {
      returned =  this.form.invalid;
    } else {
      returned = this.form.controls ['dni'].invalid;
    }

    return returned;
  }

  async validar_dni () {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
    });

    await loading.present ();

    if (this.dni_valido) {
      let data = this.form.value;
      data.sexo = parseInt (data.sexo)
      data.tipo_paciente = parseInt (data.tipo_paciente);
      data.id_user = this.api.USUARIO_DATA.id;
      data.fecha_nacimiento = data.fecha_nacimiento.substring (0, 10);
      data.uno_mismo = 0;

      console.log (data);

      this.api.registrar_paciente (data).subscribe ((res: any) => {
        loading.dismiss ();
        this.data.id_paciente = res.paciente.id;
        this.data.nombre_paciente = res.paciente.nombres + ' ' + res.paciente.apellidos
        this.navController.navigateForward (['antecedentes', JSON.stringify (this.data)]);
      }, error => {
        loading.dismiss ();
        console.log (error);
      });
    } else {
      this.api.informacion_dni (this.form.value.dni).subscribe (async (res: any) => {
        loading.dismiss ();
        console.log (res);
  
        if (res.informacion.success) {
          this.dni_valido = true;

          this.form.controls ['nombres'].setValue (res.informacion.data.nombres);
          this.form.controls ['apellidos'].setValue (res.informacion.data.apellido_paterno + ' ' + res.informacion.data.apellido_materno);
          this.form.controls ['fecha_nacimiento'].setValue (res.informacion.data.fecha_nacimiento);
          this.form.controls ['tipo_paciente'].setValue ('0');

          this.readonly = true;

          const alert = await this.alertController.create({
            header: 'Datos del paciente verificados',
            message: 'Por favor complete el género, correo y telefono del paciente.',
            buttons: ['Ok']
          });
      
          await alert.present();
        } else {
          const alert = await this.alertController.create({
            header: 'Paciente no encontrada',
            message: 'Por favor ingrese un DNI disponible.',
            buttons: ['Ok']
          });
      
          await alert.present();
        }
      }, error => {
        loading.dismiss ();
        console.log (error);
      });
    }
  }

  get_date_format (format: string) {
    return this.datetime.format (format);
  }

  get_relative_date () {
    if (this.datetime.isSame (moment (), 'day')) {
      return 'Hoy';
    } else if (this.datetime.isSame (moment().add (1, 'days'), 'day')) {
      return 'Mañana';
    }

    let day: string = this.datetime.format ('dddd');
    return day.charAt(0).toUpperCase () + day.slice (1);
  }

  get_date () {
    let month: string = this.datetime.format ('MMM');
    return this.datetime.format ('DD[ ]') + month.charAt(0).toUpperCase () + month.slice (1);
  }

  get_foto (data: any) {
    if (data.fotografia === null) {
      return 'data:image/png;base64,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';
    }

    return 'https://www.acudeapp.com/storage/' + data.fotografia;
  }
}
