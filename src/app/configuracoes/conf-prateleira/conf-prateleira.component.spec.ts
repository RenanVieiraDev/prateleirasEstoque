import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfPrateleiraComponent } from './conf-prateleira.component';

describe('ConfPrateleiraComponent', () => {
  let component: ConfPrateleiraComponent;
  let fixture: ComponentFixture<ConfPrateleiraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfPrateleiraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfPrateleiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
