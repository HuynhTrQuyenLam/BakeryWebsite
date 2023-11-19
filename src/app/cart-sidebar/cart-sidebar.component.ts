import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css']
})
export class CartSidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();

  products: any[] = [];


  constructor(private router: Router) {}

  showDeletePopup: boolean = false;
  showAddToCartButton: boolean = false;
  selectedProductId: number | null = null;

  onClose(): void {
    this.closeSidebar.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.getCartFromLocalStorage();
    }
  }

  getCartFromLocalStorage(): void {
    const cartString = localStorage.getItem('cart');
    if (cartString) {
      this.products = JSON.parse(cartString);
    } else {
      this.products = [];
    }
  }

  onClickDeleteIcon(id: number): void {
    // Hiển thị popup chỉ khi bấm vào icon delete hoặc hover vào card sản phẩm tương ứng
    if (this.selectedProductId === id || this.hoverProductId === id) {
      this.showDeletePopup = true;
      this.selectedProductId = id;
    }
  }
  

  // Hàm xử lý khi bấm vào chữ "Delete" trong khung chữ nhật
  onDeleteProduct(): void {
    if (this.selectedProductId !== null) {
      // Xóa sản phẩm khỏi danh sách
      const index = this.products.findIndex(product => product.id === this.selectedProductId);
      if (index !== -1) {
        this.products.splice(index, 1);
      }

      // Sau khi xóa xong, ẩn khung chữ nhật và reset selectedProductId
      this.showDeletePopup = false;
      this.selectedProductId = null;
    }
  }

  onDeleteAll(): void {
    localStorage.setItem('cart', JSON.stringify([]));
    this.products = [];
  }

  // Hàm xử lý khi di chuột ra khỏi khung chữ nhật mà không bấm vào "Delete"
  onCancelDelete(): void {
    this.showDeletePopup = false;
    this.selectedProductId = null;
  }
  
  hoverProductId: number | null = null;
  // Hiển thị button "Add to cart" khi chuột di vào card sản phẩm
  onMouseEnter(id: number): void {
    this.hoverProductId = id;
    this.showAddToCartButton = true;
  }

// Ẩn button "Add to cart" khi chuột không còn di vào card sản phẩm
  onMouseLeave(): void {
    this.hoverProductId = null;
    this.showAddToCartButton = false;
  }

  goToProductDetail(product: any): void {
    this.router.navigateByUrl('/cart');
  }
}
