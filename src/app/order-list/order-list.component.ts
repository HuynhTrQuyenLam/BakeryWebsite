import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getOrderListFromLocalStorage();
  }

  getOrderListFromLocalStorage(): void {
    const cartString = localStorage.getItem('paymentInfo');
    if (cartString) {
      this.orders = JSON.parse(cartString);
    } else {
      this.orders = [];
    }
  }

  goToOrderDetail(): void {
    this.router.navigateByUrl('/order-detail');
  }
}
