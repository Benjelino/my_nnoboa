import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HousesearchPage } from './housesearch.page';

describe('HousesearchPage', () => {
  let component: HousesearchPage;
  let fixture: ComponentFixture<HousesearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HousesearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HousesearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
