import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPeruanoExtrajeroPage } from './datos-peruano-extrajero.page';

describe('DatosPeruanoExtrajeroPage', () => {
  let component: DatosPeruanoExtrajeroPage;
  let fixture: ComponentFixture<DatosPeruanoExtrajeroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPeruanoExtrajeroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPeruanoExtrajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
