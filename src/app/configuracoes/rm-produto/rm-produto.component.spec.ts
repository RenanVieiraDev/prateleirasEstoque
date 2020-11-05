import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmProdutoComponent } from './rm-produto.component';

describe('RmProdutoComponent', () => {
  let component: RmProdutoComponent;
  let fixture: ComponentFixture<RmProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
