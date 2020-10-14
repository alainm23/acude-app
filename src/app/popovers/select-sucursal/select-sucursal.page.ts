import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-sucursal',
  templateUrl: './select-sucursal.page.html',
  styleUrls: ['./select-sucursal.page.scss'],
})
export class SelectSucursalPage implements OnInit {
  @Input () items: any [] = [];
  constructor (private popoverController: PopoverController) { }

  ngOnInit() {
    console.log (this.items);
  }

  select (item: any) {
    this.popoverController.dismiss (item, 'ok');
  }
}
