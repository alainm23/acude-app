import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-estamos-trabajando',
  templateUrl: './estamos-trabajando.page.html',
  styleUrls: ['./estamos-trabajando.page.scss'],
})
export class EstamosTrabajandoPage implements OnInit {

  constructor (private navController: NavController) { }

  ngOnInit() {
  }

  go_home () {
    this.navController.navigateRoot ('login');
  }
}
