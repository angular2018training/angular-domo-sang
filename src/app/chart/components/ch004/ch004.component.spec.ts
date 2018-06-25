import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ch004Component } from './ch004.component';

describe('Ch004Component', () => {
  let component: Ch004Component;
  let fixture: ComponentFixture<Ch004Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ch004Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ch004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
