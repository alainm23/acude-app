import { Component, OnInit, Input } from '@angular/core';
import { PagoService } from '../services/pago.service';
import KRGlue from "@lyracom/embedded-form-glue"
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  @Input () amount: number;
  @Input () currency: string;
  @Input () orderId: string;
  @Input () email: string;
  @Input () tienda_id: string = '80078824';
  // @Input () tienda_id: string = '8755077';

  promiseError = null;
  constructor (private payment: PagoService,
    private loadingCtrl: LoadingController,
    private modalController: ModalController) { }

  async ngOnInit () {
    const loading = await this.loadingCtrl.create ({
      message: 'Procesando...',
    });

    await loading.present ();

    const order = {
      form: {
        amount: this.amount,
        currency: this.currency,
        orderId: this.orderId,
        customer: {
            email: this.email
        }
      }
    };

    this.payment.get_formToken (order).subscribe ((res: any) => {
      const publicKey = this.tienda_id + ':testpublickey_N2rSDYJJIMbIKuwqe4cuf94BPQtABoCgw1k8U5l0TRr56';
      const formToken = res.resultado;
      const endpoint = 'https://api.micuentaweb.pe';

      KRGlue.loadLibrary (endpoint, publicKey).then (({ KR }) => KR.setFormConfig ({
          formToken: formToken,
          "kr-language": "es",
          // "kr-hide-debug-toolbar": true
        })
      )
      .then (({ KR }) => 
        KR.addForm ("#myPaymentForm")
      )
      .then (({ KR, result }) => {
        KR.showForm (result.formId);
        loading.dismiss ();

        KR.onSubmit ((event: any)  => {
          console.log (event);
          if (event.clientAnswer.orderStatus === "PAID") {
            KR.removeForms ();
            this.modalController.dismiss (this.get_legacyTransId (event.clientAnswer.transactions), 'PAID');
          } else {
            alert("Payment failed !");
          }
        });

        KR.onError ((event: any) => {
          console.log (event);
        });
      })
      .catch(error =>  {
        console.log (error);
      });
    }, error => {
      console.log (error);
    });
  }

  get_legacyTransId (transactions: any []) {
    let legacyTransId: string = '';

    for (let index = 0; index < transactions.length; index++) {
      legacyTransId = transactions [index].transactionDetails.cardDetails.legacyTransId;
    }

    return legacyTransId;
  }

  back () {
    this.modalController.dismiss (null, 'CLOSE');
  }
}
