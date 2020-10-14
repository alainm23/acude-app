import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-doctor-tuto',
  templateUrl: './doctor-tuto.page.html',
  styleUrls: ['./doctor-tuto.page.scss'],
})
export class DoctorTutoPage implements OnInit {

  constructor (private navController: NavController) { }

  ngOnInit() {
  }

  go_web () {
    window.open("https://www.acudeapp.com",'_system', 'location=yes');
  }

  back () {
    this.navController.back ();
  }
}
