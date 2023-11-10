import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  products: any[] = [];
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  phone: string = '';
  deliveryMethod: string = '';
  addButtonHovered = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getCartFromLocalStorage();
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

  payment(): void {

    if (this.firstName && this.lastName && this.address && this.phone && this.deliveryMethod) {
      // Lưu thông tin vào localStorage
      const shippingInfo = {
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.address,
        phone: this.phone,
        deliveryMethod: this.deliveryMethod 
      };
      localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));

      // Lấy thông tin thanh toán từ các trường nhập liệu
      const paymentInfo = this.getPaymentInfo();

      // Lấy thông tin thanh toán hiện có từ localStorage nếu có
      const existingPaymentInfo = localStorage.getItem('paymentInfo');

      if (existingPaymentInfo) {
        // Nếu đã tồn tại, lấy mảng thông tin thanh toán từ localStorage
        const paymentInfoArray = JSON.parse(existingPaymentInfo) as any[];

        // Thêm thông tin thanh toán mới vào mảng
        paymentInfoArray.push(paymentInfo);

        // Lưu thông tin thanh toán vào localStorage với key là "paymentInfo"
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfoArray));
      } else {
        // Nếu chưa tồn tại, tạo mảng mới và thêm thông tin thanh toán vào mảng
        const paymentInfoArray = [paymentInfo];

        // Lưu thông tin thanh toán vào localStorage với key là "paymentInfo"
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfoArray));
      }

      this.router.navigateByUrl('/payment');

      // Tiến hành chuyển đến trang thanh toán
    } else {
      alert('Vui lòng điền đầy đủ thông tin.');
    }


  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 (Tháng 0 là Tháng 1)
    const year = currentDate.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getPaymentInfo() {
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
    const address = (document.getElementById('address') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const deliveryMethod = (document.querySelector('input[name="deliveryMethod"]:checked') as HTMLInputElement).value;

    return {
      firstName: firstName,
      lastName: lastName,
      address: address,
      phone: phone,
      deliveryMethod: deliveryMethod,
      total: this.calculateTotal(),
      date: this.getCurrentDate()
    };
  }
}
