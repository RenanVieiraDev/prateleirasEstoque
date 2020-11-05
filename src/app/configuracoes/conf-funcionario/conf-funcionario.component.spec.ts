import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfFuncionarioComponent } from './conf-funcionario.component';

describe('ConfFuncionarioComponent', () => {
  let component: ConfFuncionarioComponent;
  let fixture: ComponentFixture<ConfFuncionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfFuncionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
