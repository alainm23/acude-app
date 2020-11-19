import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResgistrarDoctorDatosPersonalesDosPage } from './resgistrar-doctor-datos-personales-dos.page';

describe('ResgistrarDoctorDatosPersonalesDosPage', () => {
  let component: ResgistrarDoctorDatosPersonalesDosPage;
  let fixture: ComponentFixture<ResgistrarDoctorDatosPersonalesDosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResgistrarDoctorDatosPersonalesDosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResgistrarDoctorDatosPersonalesDosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
