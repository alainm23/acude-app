import { Component, OnInit, Input } from '@angular/core';

// Services
import { ApiService } from '../../services/api.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-idioma',
  templateUrl: './select-idioma.page.html',
  styleUrls: ['./select-idioma.page.scss'],
})
export class SelectIdiomaPage implements OnInit {
  @Input () items: any [] = [];
  constructor (
    private api: ApiService,
    private popoverController: PopoverController) { }

  ngOnInit() {
    
  }

  change (item: any) {
    console.log (item);
    this.popoverController.dismiss (this.items, 'ok');
  }
}
