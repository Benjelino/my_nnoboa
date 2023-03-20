import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatPrefPage } from './chat-pref.page';

describe('ChatPrefPage', () => {
  let component: ChatPrefPage;
  let fixture: ComponentFixture<ChatPrefPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPrefPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPrefPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
