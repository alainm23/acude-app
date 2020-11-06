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

  TITULO_ERROR: string = 'Lo sentimos';
  constructor (public http: HttpClient) {
    this.URL_BASE = "https://acudeapp.com";
    // this.URL_BASE = "http://appmedico.demoperu.site";
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
    let url = this.URL_BASE + '/api/soporte/actualizar-distrito-usuario'

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.post (url, {id_user: this.USUARIO_DATA.id, id_distrito: id_distrito}, { headers });
  }

  get_departamentos () {
    let url = this.URL_BASE + '/api/soporte/listado-departamentos';
    
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
    let url = this.URL_BASE + '/api/profesionales/' + tipo + '/' + idtipo + '/' + latitud + '/' + longitud + '/' + kilometros;

    console.log (url);

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  obtener_informacion_completa_profesional (id: string) {
    let url = this.URL_BASE + '/api/profesionales/obtener-informacion-completa/' + id + '/' + this.USUARIO_DATA.id;

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

  buscar (search_text: string) {
    let url = this.URL_BASE + '/api/busquedas/buscar/' + search_text;

    const headers = {
      'Authorization': 'Bearer ' + this.USUARIO_ACCESS.access_token
    }

    return this.http.get (url, { headers });
  }

  buscar_profesional_avanzado (tipo_profesional: string, departamento: number,
      idespecialidad: string=null, experiencia: number=null, idiomas: string=null,
      honorario_minimo: number=null, honorario_maximo: number=null,
      atiende_domicilio: number=null, emergencias: number=null, telemedicina: number=null) {
    let opcionales = '';
    if (idespecialidad !== null) {
      opcionales += '&idespecialidad=' + idespecialidad;
    }

    if (experiencia !== null) {
      opcionales += '&experiencia=' + experiencia;
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

  obtener_centros_medicos (latitud: number, longitud: number, tipo_centro: string, kilometros: number=5, limite: number=10) {
    let url = this.URL_BASE + '/api/establecimientos/' + latitud + '/' + longitud + '/' + tipo_centro;// + '?kilometros=' + kilometros;

    if (kilometros !== -1) {
      url += '&kilometros=' + kilometros;
    }

    url += '&limite=' + limite;
    url = url.replace (new RegExp('&'), '?');

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

  obtener_informacion_profesionales_lista (string_cm: string) {
    let url = this.URL_BASE + '/api/profesionales/obtener-informacion-lista/' + string_cm;

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
}
