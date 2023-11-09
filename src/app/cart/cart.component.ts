import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: any[] = [];

  addButtonHovered = false;

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.getCartFromLocalStorage();
  }

  getCartFromLocalStorage(): void {
    const cartString = localStorage.getItem('cart');
    if (cartString) {
      this.cartItems = JSON.parse(cartString);
    } else {
      this.cartItems = [];
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateTotal(item);
    }
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateTotal(item);
  }

  calculateTotal(): number {
    let total = 0;
    this.cartItems.forEach(item => {
      const itemTotal = parseFloat(item.total); 
      total += itemTotal;
    });
    return total;
  }

  updateTotal(item: CartItem): void {
    item.total = item.price * item.quantity;
  }

  addToCart(): void {
    // Hàm thêm sản phẩm vào giỏ hàng
  }

  checkout(): void {
    this.router.navigateByUrl('/order');
  }
}
