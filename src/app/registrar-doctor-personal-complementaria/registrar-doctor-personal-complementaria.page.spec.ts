import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistrarDoctorPersonalComplementariaPage } from './registrar-doctor-personal-complementaria.page';

describe('RegistrarDoctorPersonalComplementariaPage', () => {
  let component: RegistrarDoctorPersonalComplementariaPage;
  let fixture: ComponentFixture<RegistrarDoctorPersonalComplementariaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarDoctorPersonalComplementariaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarDoctorPersonalComplementariaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
