import { Injectable } from '@angular/core';

// Services
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  URL_BASE: string;
  USUARIO_ACCESS: any;
  USUARIO_DATA: any;
  constructor (public http: HttpClient) {
    // this.URL_BASE = "https://acudeapp.com";
    this.URL_BASE = "http://appmedico.demoperu.site";
  }

  login (email: string, password: string) {
    let url = this.URL_BASE + '/api/auth/login';
    return this.http.post (url, {email: email, password: password});
  }

  logout () {
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
    let url = this.URL_BASE + '/api/auth/actualizar-distrito-usuario'

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, {id_user: this.USUARIO_DATA.id, id_distrito: id_distrito}, { headers });
  }

  get_departamentos () {
    let url = this.URL_BASE + '/api/auth/listado-departamentos';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_provincias (id: string) {
    let url = this.URL_BASE + '/api/auth/listado-provincias/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_distritos (id: string) {
    let url = this.URL_BASE + '/api/auth/listado-distritos/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  registrar_usuario (data: any) {
    let url = this.URL_BASE + '/api/auth/registrar-usuario';
    return this.http.post (url, data);
  }

  get_profesionales_salud () {
    let url = this.URL_BASE + '/api/auth/get-profesionales-salud';

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_especialidad_by_profesionales (id: string) {
    let url = this.URL_BASE + '/api/auth/filtrar-especialidades/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_profesionales_ubicacion (latitud: number, longitud: number, distancia: number, id_especialidad: string) {
    let url = this.URL_BASE + '/api/auth/obtener-profesionales-ubicacion/' + latitud + '/' + longitud + '/' + distancia + '/' + id_especialidad;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_informacion_completa_profesional (id: string) {
    let url = this.URL_BASE + '/api/auth/obtener-informacion-completa-profesional/' + id + '/' + this.USUARIO_DATA.id;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_listado_publicidades () {
    let url = this.URL_BASE + '/api/auth/listado-publicidades-home';
    
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

  get_categoria_publicidades () {
    let url = this.URL_BASE + '/api/auth/categorias-publicidades';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_listado_publicaciones_by_categoria (id: string) {
    let url = this.URL_BASE + '/api/auth/listado-publicidades-categoria/' + id;
    
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

  get_tipos_centros_medicos (tipo: string) {
    let url = this.URL_BASE + '/api/auth/' + tipo;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_centros_medicos (latitud: number, longitud: number, distancia: number, id_especialidad: string) {
    let url = this.URL_BASE + '/api/auth/obtener-centros-medicos/' + latitud + '/' + longitud + '/' + distancia + '/' + id_especialidad;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_centros_medicos_lista (ids: string) {
    let url = this.URL_BASE + '/api/auth/obtener-informacion-sucursales-lista/' + ids;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_detalle_centro_medico (id: string) {
    let url = this.URL_BASE + '/api/auth/obtener-informacion-completa-centro-medico/' + id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  agregar_favorito (tipo_relacion: number, id_relacion: string) {
    let url = this.URL_BASE + '/api/auth/agregar-favorito';

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
    let url = this.URL_BASE + '/api/auth/eliminar-favorito/' + this.USUARIO_DATA.id + '/' + id_relacion + '/' + tipo_relacion;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_informacion_profesionales_lista (string_consultorios: string, string_cm: string) {
    let url = this.URL_BASE + '/api/auth/obtener-informacion-profesionales-lista/' + string_consultorios + '/' + string_cm;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_idiomas () {
    let url = this.URL_BASE + '/api/auth/listado-idiomas';
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  get_favoritos () {
    let url = this.URL_BASE + '/api/auth/obtener-listado-favoritos/' + this.USUARIO_DATA.id;
    
    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }
}
