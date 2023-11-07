import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfoCmtComponent } from './product-info-cmt.component';

describe('ProductInfoCmtComponent', () => {
  let component: ProductInfoCmtComponent;
  let fixture: ComponentFixture<ProductInfoCmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductInfoCmtComponent]
    });
    fixture = TestBed.createComponent(ProductInfoCmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
