import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscojeFechaHoraPage } from './escoje-fecha-hora.page';

describe('EscojeFechaHoraPage', () => {
  let component: EscojeFechaHoraPage;
  let fixture: ComponentFixture<EscojeFechaHoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscojeFechaHoraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscojeFechaHoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
