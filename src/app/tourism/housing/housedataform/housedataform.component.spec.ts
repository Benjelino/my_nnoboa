import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HousedataformComponent } from './housedataform.component';

describe('HousedataformComponent', () => {
  let component: HousedataformComponent;
  let fixture: ComponentFixture<HousedataformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HousedataformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HousedataformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
