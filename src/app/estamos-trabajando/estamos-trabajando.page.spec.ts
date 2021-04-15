import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstamosTrabajandoPage } from './estamos-trabajando.page';

describe('EstamosTrabajandoPage', () => {
  let component: EstamosTrabajandoPage;
  let fixture: ComponentFixture<EstamosTrabajandoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstamosTrabajandoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstamosTrabajandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
