import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TributelistComponent } from './tributelist.component';

describe('TributelistComponent', () => {
  let component: TributelistComponent;
  let fixture: ComponentFixture<TributelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TributelistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TributelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
