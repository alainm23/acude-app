import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResgistrarDoctorDatosPersonalesPage } from './resgistrar-doctor-datos-personales.page';

describe('ResgistrarDoctorDatosPersonalesPage', () => {
  let component: ResgistrarDoctorDatosPersonalesPage;
  let fixture: ComponentFixture<ResgistrarDoctorDatosPersonalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResgistrarDoctorDatosPersonalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResgistrarDoctorDatosPersonalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
