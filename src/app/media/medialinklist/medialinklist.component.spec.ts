import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MedialinklistComponent } from './medialinklist.component';

describe('MedialinklistComponent', () => {
  let component: MedialinklistComponent;
  let fixture: ComponentFixture<MedialinklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedialinklistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MedialinklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
