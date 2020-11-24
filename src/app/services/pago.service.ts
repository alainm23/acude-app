import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
declare var Culqi: any;

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private fooSubject = new Subject<any> ();
  constructor (public http: HttpClient) {
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
    Culqi.publicKey = 'pk_test_ddc278666ef0f6ce';
  }

  cfgFormulario (descripcion: string, cantidad: number) {
    // Culqi.getOptions.style.logo = "https://firebasestorage.googleapis.com/v0/b/cps-database.appspot.com/o/icon-240.png?alt=media&token=4a678de0-f8ad-4370-a60d-be2e305d5d77";
    Culqi.settings ({
      title: 'ACUDE APP',
      currency: 'PEN',
      description: descripcion,
      amount: cantidad
    });
  }

  open () {
    Culqi.open ();
  }
}
