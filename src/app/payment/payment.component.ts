import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  products: any[] = [];
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  phone: string = '';
  deliveryMethod: string = ''; 
  ngOnInit(): void {
    this.getCartFromLocalStorage();
    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}');
    this.firstName = shippingInfo.firstName || '';
    this.lastName = shippingInfo.lastName || '';
    this.address = shippingInfo.address || '';
    this.phone = shippingInfo.phone || '';
    this.deliveryMethod = shippingInfo.deliveryMethod || '';
  }

  getCartFromLocalStorage(): void {
    const cartString = localStorage.getItem('cart');
    if (cartString) {
      this.products = JSON.parse(cartString);
    } else {
      this.products = [];
    }
  }

  calculateTotal(): number {
    let total = 0;
    this.products.forEach(item => {
      const itemTotal = parseFloat(item.total); 
      total += itemTotal;
    });
    return total;
  }

  addButtonHovered = false;

  constructor(private router: Router) {}

  payment(): void {
    this.router.navigateByUrl('/order-confirmation');
    localStorage.removeItem('cart');
  }
}
