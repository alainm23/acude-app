import { Component, OnInit } from '@angular/core';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-califica-atencion',
  templateUrl: './califica-atencion.page.html',
  styleUrls: ['./califica-atencion.page.scss'],
})
export class CalificaAtencionPage implements OnInit {
  attention_rating: number = 0;
  colors: any = {
    GREY: "#E0E0E0",
    GREEN: "#76ff03",
    YELLOW: "#FFCA28",
    RED: "#DD2C00"
  };

  form: FormGroup;
  item: any;
  size: any;
  constructor (private api: ApiService, 
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private navController: NavController) { }

  ngOnInit() {
    this.item = JSON.parse (this.route.snapshot.paramMap.get ('item'));
    this.size = parseInt (this.route.snapshot.paramMap.get ('size'));

    console.log (this.item);
    console.log (this.size);

    this.form = new FormGroup ({
      comment: new FormControl (''),
    });
  }

  rate (tipo: number, index: number) {
    if (tipo == 0) {
      this.attention_rating = index;
    } else if (tipo == 1) {  
      // this.quality_rating = index;
    } else {
      // this.price_rating = index;
    }
  }

  getColor (tipo: number, index: number) {
    let rating;

    if (tipo == 0) {
      rating = this.attention_rating;
    } else if (tipo == 1) {  
      // rating = this.quality_rating;
    } else {
      // rating = this.price_rating;
    }


    if (this.isAboveRating (index, rating)) {
      return this.colors.GREY;
    }

    switch (rating) {
      case 1:
      case 2:
        return this.colors.RED;
      case 3:
        return this.colors.YELLOW;
      case 4:
      case 5:
        return this.colors.GREEN;        
      default:
        return this.colors.GREY;
    }
  }

  isAboveRating(index: number, rating: number): boolean {
    return index > rating;
  }

  async submit () {
    if (this.attention_rating > 0) {
      const loading = await this.loadingCtrl.create({
        message: 'Procesando...',
      });
  
      await loading.present ();
  
      let request: any = {
        puntuacion_1: this.attention_rating,
        descripcion: this.form.value.comment,
        id_cita: this.item.id_cita
      };
  
      console.log (request);
  
      this.api.guardar_calificacion (request).subscribe ((res: any) => {
        console.log (res);
        loading.dismiss ();
  
        if (this.size -1 > 0) {
          this.navController.back ();
        } else {
          this.navController.navigateRoot ('home');
        }
      }, error => {
        console.log (error);
        loading.dismiss ();
      });
    }
  }

  back () {
    this.navController.back ();
  }
}
