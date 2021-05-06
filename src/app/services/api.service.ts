import { Injectable } from '@angular/core';

// Services
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  URL_BASE: string;
  USUARIO_ACCESS: any;
  USUARIO_DATA: any;
  PAIS: any;

  TITULO_ERROR: string = 'Lo sentimos';
  private usuario_subject = new Subject<any> ();
  constructor (public http: HttpClient, private fb: Facebook, private platform: Platform) {
    this.URL_BASE = "https://acudeapp.com";
    // this.URL_BASE = "https://appmedico.demoperu.site";
  }

  usuario_changed (data: any) {
    this.usuario_subject.next (data);
  }

  get_usuario_observable (): Subject<any> {
    return this.usuario_subject;
  }
  
  login (email: string, password: string) {
    let url = this.URL_BASE + '/api/auth/login';
    return this.http.post (url, {email: email, password: password});
  }

  logout () {
    if (this.platform.is ('cordova')) {
      this.fb.getLoginStatus ().then ((res) => {
        if (res.status === 'connected') {
          this.fb.logout ();
        }
      });
    }

    let url = this.URL_BASE + '/api/auth/logout';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_user (access_token: string) {
    let url = this.URL_BASE + '/api/auth/user'
    
    const headers = {
      'Authorization': 'Bearer ' + access_token
    }

    return this.http.get (url, { headers });
  }

  actualizar_distrito_usuario (id_distrito: string) {
    let url = this.URL_BASE + '/api/soporte/actualizar-departamento-usuario'

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, {id_user: this.USUARIO_DATA.id, id_departamento: id_distrito}, { headers });
  }

  get_departamentos () {
    console.log (this.PAIS);
    let url = this.URL_BASE + '/api/soporte/listado-departamentos/' + this.PAIS.id;
    console.log (url);

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_provincias (id: string) {
    let url = this.URL_BASE + '/api/soporte/listado-provincias/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_distritos (id: string) {
    let url = this.URL_BASE + '/api/soporte/listado-distritos/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  registrar_usuario (data: any) {
    data.id_pais = this.PAIS.id;
    let url = this.URL_BASE + '/api/auth/registrar-usuario';
    return this.http.post (url, data);
  }

  get_profesionales_salud () {
    let url = this.URL_BASE + '/api/profesionales/categorias';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_especialidad_by_profesionales (id: string) {
    let url = this.URL_BASE + '/api/profesionales/especialidades/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_profesionales_ubicacion (tipo: string, idtipo: string, latitud: number, longitud: number, kilometros: number) {
    let url = this.URL_BASE + '/api/profesionales/' + tipo + '/' + idtipo + '/' + latitud + '/' + longitud + '/' + kilometros + '/' + this.PAIS.id  + '?limite=10';
    console.log (url);

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_informacion_completa_profesional (id: string) {
    let url = this.URL_BASE + '/api/profesionales/obtener-informacion-completa/' + id + '/' + this.USUARIO_DATA.id + '/' + this.PAIS.id;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_listado_publicidades (id_departamento: number, limite: number) {
    let url = this.URL_BASE + '/api/publicidades/mostrar/' + id_departamento + '?limite=' + limite + '&orden=0';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_all_listado_publicidades () {
    let url = this.URL_BASE + '/api/auth/listado-publicidades';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_categoria_publicidades (departamento_id: number) {
    let url = this.URL_BASE + '/api/publicidades/tipos/'+ departamento_id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_listado_publicaciones_by_categoria (id: string) {
    let url = this.URL_BASE + '/api/publicidades/listado/' + id;

    console.log (url);

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_detalle_publicidad (id: string) {
    let url = this.URL_BASE + '/api/auth/detalle-publicidad/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_tipos_centros_medicos (departamento: number, limite: number=-1) {
    let url;
    if (limite <= 0) {
      url = this.URL_BASE + '/api/establecimientos/tipos/' + departamento;
    } else {
      url = this.URL_BASE + '/api/establecimientos/tipos/' + departamento + '?limite=' + limite;
    }

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  buscar (search_text: string, departamento_id: string) {
    let url = this.URL_BASE + '/api/busquedas/buscar/' + search_text + '/' + departamento_id;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  buscar_profesional_avanzado (
    tipo_profesional: string,
    departamento: number,
    idespecialidad: string=null,
    experiencia_min: number=null,
    experiencia_max:number=null,
    idiomas: string=null,
    honorario_minimo: number=null,
    honorario_maximo: number=null,
    atiende_domicilio: number=null,
    emergencias: number=null,
    telemedicina: number=null) {
    let opcionales = '';
    if (idespecialidad !== null) {
      opcionales += '&idespecialidad=' + idespecialidad;
    }

    if (experiencia_min !== null) {
      opcionales += '&experiencia_min=' + experiencia_min;
    }

    if (experiencia_max !== null) {
      opcionales += '&experiencia_max=' + experiencia_max;
    }

    if (idiomas !== null) {
      opcionales += '&idiomas=' + idiomas;
    }

    if (honorario_minimo !== null) {
      opcionales += '&honorario_minimo=' + honorario_minimo;
    }

    if (honorario_maximo !== null) {
      opcionales += '&honorario_maximo=' + honorario_maximo;
    }
    
    if (atiende_domicilio !== null) {
      opcionales += '&atiende_domicilio=' + atiende_domicilio;
    }

    if (emergencias !== null) {
      opcionales += '&emergencias=' + emergencias;
    }
    
    if (telemedicina !== null) {
      opcionales += '&telemedicina=' + telemedicina;
    }

    opcionales = opcionales.replace (new RegExp('&'), '?');

    let url = this.URL_BASE + '/api/busquedas/buscar-profesional/' + tipo_profesional + '/' + departamento + opcionales;

    console.log (url);
        
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  } 

  obtener_centros_medicos (latitud: number, longitud: number, tipo_centro: string, kilometros: string, limite: number=10) {
    let url = this.URL_BASE + '/api/establecimientos/' + latitud + '/' + longitud + '/' + tipo_centro + '/' + this.PAIS.id;

    url += '&kilometros=' + kilometros;
    url += '&limite=' + limite;
    url = url.replace (new RegExp('&'), '?');

    console.log (kilometros);
    console.log (url);

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_centros_medicos_lista (ids: string) {
    let url = this.URL_BASE + '/api/establecimientos/obtener-informacion-sucursales-lista/' + ids;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_detalle_centro_medico (id: string) {
    let url = this.URL_BASE + '/api/establecimientos/obtener-informacion-completa/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_verificar_favorito (id_sucursal: string) {
    let url = this.URL_BASE + '/api/soporte/consultar-favorito-sucursal/' + this.USUARIO_DATA.id + '/' + id_sucursal;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  agregar_favorito (tipo_relacion: number, id_relacion: string) {
    let url = this.URL_BASE + '/api/soporte/agregar-favorito';

    let data: any = {
      id_usuario_logeado: this.USUARIO_DATA.id,
      id_relacion: id_relacion,
      tipo_relacion: tipo_relacion
    };

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }
  
  eliminar_favorito (tipo_relacion: number, id_relacion: string) {
    let url = this.URL_BASE + '/api/soporte/eliminar-favorito/' + this.USUARIO_DATA.id + '/' + id_relacion + '/' + tipo_relacion;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_informacion_profesionales_lista (string_cm: string, especialidad_id: string) {
    let url = this.URL_BASE + '/api/profesionales/obtener-informacion-lista/' + string_cm + '/' + especialidad_id + '/' + this.PAIS.id;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_idiomas () {
    let url = this.URL_BASE + '/api/soporte/listado-idiomas';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_favoritos () {
    let url = this.URL_BASE + '/api/soporte/obtener-listado-favoritos/' + this.USUARIO_DATA.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_numero_emergencia (departamento: number) {
    let url = this.URL_BASE + '/api/soporte/obtener-telefono-emergencia/' + departamento;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  actualizar_usuario (form: any) {
    let url = this.URL_BASE + '/api/auth/actualizar-usuario';

    let data: any = {
      id_user: this.USUARIO_DATA.id,
      fName: form.fName,
      lName: form.lName,
      password: null,
      imagen: form.imagen
    };
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }

  login_social (tipo: string, email: string, token_uid: string, avatar: string, nombre: string, apellido: string) {
    let url = this.URL_BASE + '/api/auth/login-social';

    let data: any = {
      tipo: tipo,
      email: email,
      token_uid: token_uid,
      avatar: avatar,
      nombre: nombre,
      apellido: apellido
    };

    return this.http.post (url, data);
  }

  registrar_cita (data: any) {
    let url = this.URL_BASE + '/api/cita/registrar-cita';

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }

  actualizar_datos_pago (data: any) {
    let url = this.URL_BASE + '/api/auth/actualizar-datos-pago';

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }

  relacionados_pacientes () {
    let url = this.URL_BASE + '/api/cita/pacientes/relacionados-pacientes/' + this.USUARIO_DATA.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }
  
  informacion_dni (dni: number) {
    let url = this.URL_BASE + '/api/cita/pacientes/informacion-dni/' + dni + '/' + this.PAIS.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  registrar_paciente (data: any) {
    let url = this.URL_BASE + '/api/cita/pacientes/registrar-paciente';

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }

  registrar_antecedentes (data: any) {
    let url = this.URL_BASE + '/api/cita/pacientes/registrar-antecedentes';

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }

  historial_citas () {
    let url = this.URL_BASE + '/api/cita/pacientes/historial-citas-user/' + this.USUARIO_DATA.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  verificar_disponibilidad (id_centro_medico_profesional: number) {
    let url = this.URL_BASE + '/api/cita/pacientes/verificar-disponibilidad/' + id_centro_medico_profesional;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  reprogramar_cita (data: any) {
    let url = this.URL_BASE + '/api/cita/pacientes/reprogramar-cita';

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }

  obtener_informacion_completa (id_profesional: number) {
    let url = this.URL_BASE + '/api/profesionales/obtener-informacion-completa/' + id_profesional + '/' + this.USUARIO_DATA.id + '/' + this.PAIS.id;;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  proximas_sin_pacientes () {
    let url = this.URL_BASE + '/api/cita/proximas-sin-pacientes/' + this.USUARIO_DATA.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  informacion_cita (id: number) {
    let url = this.URL_BASE + '/api/cita/informacion-cita/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  recuperar_password (email: string) {
    let url = this.URL_BASE + '/api/auth/recuperar-password';
    return this.http.post (url, {email: email});
  }

  listado_paises () {
    let url = this.URL_BASE + '/api/informacion/listado-paises';
    return this.http.get (url);
  }

  get_listado_tarifas () {
    let url = this.URL_BASE + '/api/soporte/listado-tarifas/' + this.PAIS.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  eliminar_usuario () {
    let url = this.URL_BASE + '/api/soporte/eliminar-usuario/' + this.USUARIO_DATA.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  listado_de_citas_sin_calificacion () {
    let url = this.URL_BASE + '/api/cita/pacientes/listado-de-citas-sin-calificacion/' + this.USUARIO_DATA.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  guardar_calificacion (data: any) {
    let url = this.URL_BASE + '/api/cita/pacientes/guardar-calificacion';

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, data, { headers });
  }

  get_obtener_info_emergencia () {
    let url = this.URL_BASE + '/api/soporte/obtener-info-emergencia/' + this.PAIS.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }
}
