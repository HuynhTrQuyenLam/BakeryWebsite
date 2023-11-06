import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @ViewChild('productListElement', { static: false }) productListElement!: ElementRef;

  selectedCategories: { [category: string]: boolean } = {};
  selectedPrice: number = 500;
  hoverIndex: number = -1;

  products: any[] = [];
  categories = ["PETIT","SIGNATURE CAKES", "BREAD & PASTRIES", "CUPCAKES"];

  // Số sản phẩm hiển thị trên mỗi trang
  productsPerPage: number = 12;

  // Số trang hiện tại
  currentPage: number = 1;

  // Tổng số trang
  totalPages: number;

  totalPagesArray: number[] = [];

  constructor(private db: AngularFireDatabase, private productService: ProductService, private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getProductsFromFirebase();
  }

  // Hàm lấy danh sách sản phẩm từ Firebase
  getProductsFromFirebase(): void {
    this.db.list('/products').valueChanges().subscribe((products: any[]) => {
      this.products = products;
      console.log(products);
      this.calculateTotalPages();
    });
  }

  // Hàm tính toán tổng số trang
  calculateTotalPages(): void {
    console.log(this.filteredProducts.length);
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.updateTotalPagesArray();
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

  // Hàm chuyển đến trang cụ thể
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

  // Hàm scroll đến đầu trang
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

  // Chuyển đến trang chi tiết sản phẩm
  goToProductDetail(product: any): void {
    console.log(product);
    this.productService.setSelectedProduct(product);
    this.router.navigateByUrl('/product/' + product.id);
  }

  // Hiển thị icon yêu thích khi di chuột vào sản phẩm
  showAddToCart(index: number): void {
    this.hoverIndex = index;
  }

  // Ẩn icon yêu thích khi di chuột ra khỏi sản phẩm
  hideAddToCart(): void {
    this.hoverIndex = -1;
  }

  // Hàm cài đặt giao diện danh sách sản phẩm
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

  // Xóa khỏi danh sách yêu thích
  removeFromFavorites(product: any): void {
    product.isFavorite = false;
  }

  addToCart(selectedProduct: any): void {
    console.log(selectedProduct);
    // Hàm thêm sản phẩm vào giỏ hàng
    // Kiểm tra xem danh sách giỏ hàng đã tồn tại trong localStorage chưa
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.');
        return;
    }
    let cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex(product => product.id === selectedProduct.id);

    if (productIndex !== -1) {
      // If the product already exists in the cart, update the quantity and total
      cart[productIndex].quantity = (cart[productIndex].quantity || 1) + 1;
      cart[productIndex].total = cart[productIndex].quantity * cart[productIndex].price;
      cart[productIndex].images = [selectedProduct.image]
    } else {
      // Thêm sản phẩm vào danh sách giỏ hàng
      selectedProduct.quantity = 1;
      selectedProduct.total = selectedProduct.price; // Initial total for a new product
      selectedProduct.images = [selectedProduct.image]
      cart.push(selectedProduct);
    }

    // Lưu danh sách giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Add cart success');
  }

  addToFavorites(selectedProduct: any): void {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sản phẩm vào yêu thích.');
        return;
    }
    // Kiểm tra xem danh sách yêu thích đã tồn tại trong localStorage chưa
    let favorites: any[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isProductInFavorites = favorites.some(product => product.id === selectedProduct.id);

    if (!isProductInFavorites) {
      // Thêm sản phẩm vào danh sách yêu thích
      selectedProduct.images = [selectedProduct.image]
      favorites.push(selectedProduct);
      // Lưu danh sách yêu thích vào localStorage
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert("Add favorites success");
    } else {
      alert("You have more favorite before that");
    }
  }
}
