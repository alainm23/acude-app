import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalificaAtencionPage } from './califica-atencion.page';

describe('CalificaAtencionPage', () => {
  let component: CalificaAtencionPage;
  let fixture: ComponentFixture<CalificaAtencionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalificaAtencionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalificaAtencionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
