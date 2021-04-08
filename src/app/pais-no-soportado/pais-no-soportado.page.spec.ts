import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaisNoSoportadoPage } from './pais-no-soportado.page';

describe('PaisNoSoportadoPage', () => {
  let component: PaisNoSoportadoPage;
  let fixture: ComponentFixture<PaisNoSoportadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaisNoSoportadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaisNoSoportadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
