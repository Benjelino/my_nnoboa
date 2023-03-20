import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSearchPage } from './client-search.page';

describe('ClientSearchPage', () => {
  let component: ClientSearchPage;
  let fixture: ComponentFixture<ClientSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
