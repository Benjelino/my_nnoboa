import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HscComponent } from './hsc.component';

describe('HscComponent', () => {
  let component: HscComponent;
  let fixture: ComponentFixture<HscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HscComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
