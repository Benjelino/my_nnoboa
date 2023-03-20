import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HouselistPage } from './houselist.page';

describe('HouselistPage', () => {
  let component: HouselistPage;
  let fixture: ComponentFixture<HouselistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouselistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HouselistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
