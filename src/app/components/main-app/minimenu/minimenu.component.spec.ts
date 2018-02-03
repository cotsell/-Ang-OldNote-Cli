import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimenuComponent } from './minimenu.component';

describe('MinimenuComponent', () => {
  let component: MinimenuComponent;
  let fixture: ComponentFixture<MinimenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
