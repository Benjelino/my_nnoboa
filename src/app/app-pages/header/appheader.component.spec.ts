import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Appheader } from './appheader.component';

describe('HeaderComponent', () => {
  let component: Appheader;
  let fixture: ComponentFixture<Appheader>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appheader ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Appheader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
