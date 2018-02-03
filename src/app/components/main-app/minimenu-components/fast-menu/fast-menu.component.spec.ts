import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastMenuComponent } from './fast-menu.component';

describe('FastMenuComponent', () => {
  let component: FastMenuComponent;
  let fixture: ComponentFixture<FastMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
