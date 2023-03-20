import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ToursearchComponent } from './toursearch.component';

describe('ToursearchComponent', () => {
  let component: ToursearchComponent;
  let fixture: ComponentFixture<ToursearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToursearchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ToursearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
