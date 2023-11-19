import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private selectedProduct: any;

  constructor() { }

  setSelectedProduct(product: any): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): any {
    return this.selectedProduct;
  }
}
