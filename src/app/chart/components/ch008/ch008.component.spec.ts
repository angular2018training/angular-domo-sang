import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ch008Component } from './ch008.component';

describe('Ch008Component', () => {
  let component: Ch008Component;
  let fixture: ComponentFixture<Ch008Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ch008Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ch008Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
