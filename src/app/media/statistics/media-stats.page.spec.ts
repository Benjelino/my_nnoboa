import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MediaStatsPage } from './media-stats.page';

describe('MediaStatsPage', () => {
  let component: MediaStatsPage;
  let fixture: ComponentFixture<MediaStatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaStatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
