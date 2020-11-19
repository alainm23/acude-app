import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResgistrarDoctorDatosPersonalesTresPage } from './resgistrar-doctor-datos-personales-tres.page';

describe('ResgistrarDoctorDatosPersonalesTresPage', () => {
  let component: ResgistrarDoctorDatosPersonalesTresPage;
  let fixture: ComponentFixture<ResgistrarDoctorDatosPersonalesTresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResgistrarDoctorDatosPersonalesTresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResgistrarDoctorDatosPersonalesTresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
