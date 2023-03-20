import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TributeComponent } from './tribute.component';

describe('TributeComponent', () => {
  let component: TributeComponent;
  let fixture: ComponentFixture<TributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TributeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
