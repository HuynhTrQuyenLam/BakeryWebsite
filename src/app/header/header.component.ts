import { Component, ElementRef, HostListener,Renderer2, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isSearchOpen: boolean = false;
  isProfileOpen: boolean = false;
  isCartOpen: boolean = false;
  isUserLoggedIn: boolean = false;

  searchQuery: string = '';
  products: any[] = [];
  displayedProducts: any[] = [];

  selectedOption: string = 'home';
  isMovingBar: boolean = false;

  constructor(private db: AngularFireDatabase, private elementRef: ElementRef, private router: Router, private renderer: Renderer2, private productService: ProductService) {
    this.isUserLoggedIn = !!localStorage.getItem('user');
  }

  ngOnInit(): void {
    this.getProductsFromFirebase();
  }
  

  // LOGIN
  isLoginVisible = false; 

  goToLogin(): void {
    this.router.navigateByUrl('/login');
    this.isLoginVisible = true;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.isUserLoggedIn = false;
    // Code xử lý đăng xuất khác (nếu cần thiết)
  }

  // REGISTER
  isRegisterVisible = false; 

  goToRegister(): void {
    this.router.navigateByUrl('/register');
    this.isRegisterVisible = true;
  }

  handleOrderList(): void{
    this.router.navigateByUrl('/order-list');
  }

  selectOption(option: string) {
    if (option !== this.selectedOption) {
      this.isMovingBar = true;
      const prevSelectedOption = this.selectedOption; 
      this.selectedOption = option;

      // Nếu tùy chọn trước đó là 'home', cuộn xuống phần tương ứng bên trong component Home
      if (prevSelectedOption === 'home') {
        const element = document.getElementById(option);
        if (element) {
          const headerHeight = document.querySelector('header')?.clientHeight || 0;
          const yOffset = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          this.scrollSmoothlyTo(yOffset);
        }
      } else {
        // Nếu tùy chọn trước đó là một trong các tùy chọn khác, cuộn đến phần Home trước, sau đó cuộn đến phần tương ứng bên trong component Home
        const homeElement = document.getElementById('home-content');
        if (homeElement) {
          const headerHeight = document.querySelector('header')?.clientHeight || 0;
          const yOffset = homeElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          this.scrollSmoothlyTo(yOffset);

          setTimeout(() => {
            const element = document.getElementById(option);
            if (element) {
              const yOffset2 = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
              this.scrollSmoothlyTo(yOffset2);
            }
          }, 300);
        }
      }
      if (option === 'menu') {
        this.router.navigateByUrl('/menu');
      }
    }
  }

  
  private scrollSmoothlyTo(yOffset: number) {
    window.scrollTo({ top: yOffset, behavior: 'smooth' });
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    this.isProfileOpen = false;
    this.isCartOpen = false;
  }
  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
    this.isSearchOpen = false;
    this.isCartOpen = false;
  }
  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
    this.isSearchOpen = false;
    this.isProfileOpen = false;
  }

  // Hàm lấy danh sách sản phẩm từ Firebase
  getProductsFromFirebase(): void {
    this.db.list('/products').valueChanges().subscribe((products: any[]) => {
      this.products = products;
      console.log(products);
    });
  }

  maxDisplayedProducts: number = 5;

  
  search(): void {
    if (this.searchQuery.trim() === '') {
      this.displayedProducts = [];
    } else {
      this.displayedProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).slice(0, this.maxDisplayedProducts);
    }
  }
  
  
  // Chuyển đến trang chi tiết sản phẩm
  goToProductDetail(product: any): void {
    console.log(product);
    this.productService.setSelectedProduct(product);
    this.router.navigateByUrl('/product/' + product.id);
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeAllBoxes();
    }
  }

  private closeAllBoxes() {
    this.isSearchOpen = false;
    this.isProfileOpen = false;
    this.isCartOpen = false;
  }


  isHeaderInBannerArea(): boolean {
    const headerElement = this.elementRef.nativeElement.querySelector('header');
    const bannerElement = document.querySelector('app-banner');
  
    if (headerElement && bannerElement) {
      const headerRect = headerElement.getBoundingClientRect();
      const bannerRect = bannerElement.getBoundingClientRect();
  
      return headerRect.bottom <= bannerRect.bottom && headerRect.top >= bannerRect.top;
    }
  
    return false;
  }
  


  isScrolled: boolean = false;
  isHeaderOnBanner: boolean = false; 

  @HostListener('window:scroll', ['$event'])
onScroll(event: any) {
  this.isScrolled = window.scrollY >= (document.querySelector('app-banner')?.clientHeight || 0);

  if (this.isHeaderInBannerArea()) {
    this.renderer.removeClass(this.elementRef.nativeElement, 'scrolled');
  } else {
    this.renderer.addClass(this.elementRef.nativeElement, 'scrolled');
  }
}

  showAddToCartButton: boolean = false;
  hoverProductId: number | null = null;

onMouseEnter(productId: number): void {
  this.hoverProductId = productId;
  this.showAddToCartButton = true;
}

onMouseLeave(): void {
  this.hoverProductId = null;
  this.showAddToCartButton = false;
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

  
}
