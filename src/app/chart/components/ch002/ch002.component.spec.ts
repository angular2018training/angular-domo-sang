import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ch002Component } from './ch002.component';

describe('Ch002Component', () => {
  let component: Ch002Component;
  let fixture: ComponentFixture<Ch002Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ch002Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ch002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
