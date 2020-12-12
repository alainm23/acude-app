import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild (IonSlides, { static: false }) slide: IonSlides;
  constructor (private navController: NavController) { }

  ngOnInit() {
  }

  saltar () {
    this.navController.navigateRoot ('login');
  }

  next () {
    this.slide.getActiveIndex ().then ((index: number) => {
      console.log (index);
      if (index >= 2) {
        this.saltar ();
      } else {
        this.slide.slideNext ();
      }
    });
  }
}
