import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatTestPage } from './chat-test.page';

describe('ChatTestPage', () => {
  let component: ChatTestPage;
  let fixture: ComponentFixture<ChatTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatTestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
