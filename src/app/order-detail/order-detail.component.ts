import { Component } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  products: any[] =  [
    { productName: 'Product 1', price: 100, quantity: 1, total: 100, image: 'assets/images/sp2.jpg' },
    { productName: 'Product 2', price: 50, quantity: 2, total: 100, image: 'assets/images/sp1.jpg' },
    { productName: 'Product 3', price: 30, quantity: 3, total: 90, image: 'assets/images/sp2.jpg' },
  ];

  // dữ liệu tạm
  firstName: string = 'Hang';
  lastName: string = 'Nguyen';
  address: string = 'dcdvfdvfd';
  phone: string = '0123243535';
}
