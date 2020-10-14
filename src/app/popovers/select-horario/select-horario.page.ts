import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-horario',
  templateUrl: './select-horario.page.html',
  styleUrls: ['./select-horario.page.scss'],
})
export class SelectHorarioPage implements OnInit {

  constructor (private popoverController: PopoverController) { }

  ngOnInit() {
  }

  select (event: any) {
    console.log (event);
    this.popoverController.dismiss (event.split (','), 'ok');
  }
}
