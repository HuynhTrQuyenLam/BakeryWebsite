import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  @ViewChild('productListElement', { static: false }) productListElement!: ElementRef;

  selectedCategories: { [category: string]: boolean } = {};
  selectedPrice: number = 500; 
  hoverIndex: number = -1;

  products: any[] = [];

  categories = ['BIRTHDAY CAKE', 'FRENCH PASTRIES', 'MACARON', 'DONUT'];

  // Số sản phẩm hiển thị trên mỗi trang
  productsPerPage: number = 12;

  // Số trang hiện tại
  currentPage: number = 1;

  // Tổng số trang
  totalPages: number;

  totalPagesArray: number[] = [];

  constructor(private productService: ProductService, private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getFavoritesFromLocalStorage();
    this.calculateTotalPages();
  }

  // Hàm tính toán tổng số trang 
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.updateTotalPagesArray();
  }

  getFavoritesFromLocalStorage(): void {
    const favoritesString = localStorage.getItem('favorites');
    if (favoritesString) {
      this.products = JSON.parse(favoritesString);
    } else {
      this.products = [];
    }
  }

  // Hàm cập nhật totalPagesArray
  updateTotalPagesArray(): void {
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Hàm chuyển đến trang tiếp theo
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
    }
  }

  // Hàm chuyển đến trang trước đó
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
    }
  }
  
  
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const firstProductElement = document.getElementById(`product-${startIndex}`);
      if (firstProductElement) {
        const yOffset = firstProductElement.getBoundingClientRect().top;
        this.scrollToTop(yOffset - 50); 
      }
    }
  }
  
  
  
  scrollToTop(offset: number = 0): void {
    if (this.productListElement && this.productListElement.nativeElement) {
      const element = this.productListElement.nativeElement as HTMLElement;
      element.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }
  

  // Hàm lấy danh sách sản phẩm cho trang hiện tại
  getProductsForCurrentPage(): any[] {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  // Cập nhật danh sách sản phẩm khi có thay đổi trong bộ lọc
  get filteredProducts() {
    return this.products.filter(product => {
      const isCategoryMatch = this.selectedCategories[product.category] || Object.values(this.selectedCategories).every(v => !v);
      const isPriceMatch = product.price <= this.selectedPrice;
      return isCategoryMatch && isPriceMatch;
    });
  }

  goToProductDetail(product: any): void {
    this.productService.setSelectedProduct(product);
    this.router.navigateByUrl('/product/' + product.id);
  }

  showAddToCart(index: number): void {
    this.hoverIndex = index;
  }

  hideAddToCart(): void {
    this.hoverIndex = -1;
  }


  productLayout = 3;
  selectedButton = 3;

  setProductLayout(layout: number): void {
    this.productLayout = layout;
    this.selectedButton = layout; 
  }

  getProductListClass(): string {
    switch (this.productLayout) {
      case 1:
        return 'product-list product-list-2';
      case 2:
        return 'product-list product-list-3';
      case 3:
        return 'product-list product-list-4';
      default:
        return 'product-list product-list-4';
    }
  }
}
