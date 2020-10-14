import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-seleccionar',
  templateUrl: './inicio-seleccionar.page.html',
  styleUrls: ['./inicio-seleccionar.page.scss'],
})
export class InicioSeleccionarPage implements OnInit {

  constructor (private navController: NavController) { }

  ngOnInit () {

  }

  go_page (view: string) {
    this.navController.navigateForward (view);
  } 
}
