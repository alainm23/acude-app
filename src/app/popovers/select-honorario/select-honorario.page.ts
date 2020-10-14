import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-honorario',
  templateUrl: './select-honorario.page.html',
  styleUrls: ['./select-honorario.page.scss'],
})
export class SelectHonorarioPage implements OnInit {
  @Input () min: number;
  @Input () max: number;
  value: any;
  constructor (private popoverController: PopoverController) { }

  ngOnInit () {
  }

  filtrar () {
    console.log (this.value);
    this.popoverController.dismiss ({min: this.value.lower, max: this.value.upper}, 'ok');
  }
}
