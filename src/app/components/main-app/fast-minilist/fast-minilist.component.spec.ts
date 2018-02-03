import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastMinilistComponent } from './fast-minilist.component';

describe('FastMinilistComponent', () => {
  let component: FastMinilistComponent;
  let fixture: ComponentFixture<FastMinilistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastMinilistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastMinilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
