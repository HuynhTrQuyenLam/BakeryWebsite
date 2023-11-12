import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-sidebar',
  templateUrl: './favorites-sidebar.component.html',
  styleUrls: ['./favorites-sidebar.component.css']
})
export class FavoritesSidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();

  products: any[] = [];


  constructor(private router: Router) { }

  showDeletePopup: boolean = false;
  showAddToCartButton: boolean = false;
  selectedProductId: number | null = null;

  onClose(): void {
    this.closeSidebar.emit();
  }

  ngOnInit(): void {
    this.getFavoritesFromLocalStorage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.getFavoritesFromLocalStorage();
    }
  }

  getFavoritesFromLocalStorage(): void {
    const favoritesString = localStorage.getItem('favorites');
    if (favoritesString) {
      this.products = JSON.parse(favoritesString);
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

      // Cập nhật dữ liệu yêu thích mới vào localStorage
      this.updateFavoritesToLocalStorage();
    }
  }

  updateFavoritesToLocalStorage(): void {
    localStorage.setItem('favorites', JSON.stringify(this.products));
  }

  onDeleteAll(): void {
    localStorage.setItem('favorites', JSON.stringify([]));
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
    this.router.navigateByUrl('/favorites');
  }
}
