import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
declare var SynoLiveAPI: any;

@Component({
  selector: 'app-chat-test',
  templateUrl: './chat-test.page.html',
  styleUrls: ['./chat-test.page.scss'],
})
export class ChatTestPage implements OnInit {
  @ViewChild ('syno', {static: true})  syno: ElementRef;
  constructor() { }

  ngOnInit() {
    setTimeout (() => {
      const options = {
        roomName: 'demo',
        width: '100%',
        height: '100%',
        parentNode: this.syno.nativeElement,
        userInfo: {
          email: 'alainhuntt@gmail.com',
          displayName: 'John Doe'
        }
      };
  
      const api = new SynoLiveAPI (options);
    }, 1000);
  }
}
