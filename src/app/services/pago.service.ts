import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
declare var Culqi: any;

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private fooSubject = new Subject<any> ();
  constructor (public http: HttpClient, private api: ApiService) {
    document.addEventListener ('payment_event', (token: any) => {
      let token_id = token.detail;
      this.pago_solicitado (token_id);
    }, false);
  }

  pago_solicitado (data: any) {
    this.fooSubject.next (data);
  }

  get_pago_solicitado (): Subject<any> {
    return this.fooSubject;
  }

  initCulqi () {
    // Ingresa tu "Puclic Key" que te da Culqi aqui
    // Culqi.publicKey = 'pk_test_ddc278666ef0f6ce';
    Culqi.publicKey = 'pk_live_e397d55556f9df4e';
  }

  cfgFormulario (descripcion: string, cantidad: number) {
    Culqi.getOptions.style.logo = "https://www.acudeapp.com/acude-logo.png";
    Culqi.settings ({
      title: 'ACUDE',
      currency: 'PEN',
      description: descripcion,
      amount: cantidad
    });
  }

  get_formToken (request: any) {
    console.log (this.api.USUARIO_ACCESS.access_token);

    const headers = {
      'Authorization': 'Bearer ' + this.api.USUARIO_ACCESS.access_token
    }
    return this.http.post ('https://acudeapp.com/api/crear-token/izipay', request, { headers });
  }

  open () {
    Culqi.open ();
  }
}
