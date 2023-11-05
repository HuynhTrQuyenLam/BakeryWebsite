import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent implements AfterViewInit {
  @ViewChild('carousel') carousel: ElementRef;
  @ViewChild('carouselInner') carouselInner: ElementRef;

  products: any[] = []; // Lưu trữ tất cả sản phẩm từ Firebase
  displayedProducts: any[] = [];

  itemsPerPage: number;
  maxSlideIndex: number;
  slideIndex: number = 0;
  hoverIndex: number = -1;

  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngAfterViewInit(): void {
    this.calculateItemsPerPage();
    this.getProductsFromFirebase();
  }

  calculateItemsPerPage(): void {
    this.itemsPerPage = 5;
    this.maxSlideIndex = Math.ceil(this.products.length / this.itemsPerPage) - 1;
  }

  getProductsFromFirebase(): void {
    this.db.list('/products').valueChanges().subscribe((products: any[]) => {
      this.products = products;
      this.updateDisplayedProducts();
    });
  }

  updateDisplayedProducts(): void {
    this.displayedProducts = this.products.slice(
      this.slideIndex * this.itemsPerPage,
      (this.slideIndex + 1) * this.itemsPerPage
    );
  }

  prevSlide(): void {
    if (this.slideIndex > 0) {
      this.slideIndex--;
      this.slideCarousel();
      this.updateDisplayedProducts();
    }
  }

  nextSlide(): void {
    if (this.slideIndex < this.maxSlideIndex) {
      this.slideIndex++;
      this.slideCarousel();
      this.updateDisplayedProducts();
    }
  }

  slideCarousel(): void {
    const slideOffset = this.slideIndex * -100 * this.itemsPerPage;
    const carouselInner = this.carouselInner.nativeElement as HTMLElement;
    carouselInner.style.transform = `translateX(${slideOffset}%)`;
  }

  showAddToCart(index: number): void {
    this.hoverIndex = index;
  }

  hideAddToCart(): void {
    this.hoverIndex = -1;
  }

  goToProductDetail(product: any): void {
    this.router.navigateByUrl('/product/' + product.id);
  }

  addToCart(selectedProduct: any): void {
    console.log(selectedProduct);
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.');
        return;
    }
    // Hàm thêm sản phẩm vào giỏ hàng
    // Kiểm tra xem danh sách giỏ hàng đã tồn tại trong localStorage chưa
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
    // Kiểm tra xem danh sách yêu thích đã tồn tại trong localStorage chưa
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sản phẩm vào yêu thích.');
        return;
    }
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
