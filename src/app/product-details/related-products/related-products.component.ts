import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.css']
})
export class RelatedProductsComponent implements OnInit {
  @Input() selectedProduct: any;
  relatedProducts: any[];
  hoverIndex: number = -1;

  constructor(private productService: ProductService, private router: Router, private db: AngularFireDatabase) {}

  ngOnInit(): void {
    
      this.getProductsFromFirebase();
  }

  // Hàm lấy danh sách sản phẩm từ Firebase Realtime Database
  getProductsFromFirebase(): void {
    this.db.list('/products').valueChanges().subscribe((products: any[]) => {
      console.log("=========DATA========");
      console.log(products);
      // Lọc và lấy danh sách sản phẩm liên quan
      this.relatedProducts = products.filter(product => product.category === this.selectedProduct.category && product.id !== this.selectedProduct.id);
      console.log("=========relatedProducts========");
      console.log(this.relatedProducts );
      this.relatedProducts = this.relatedProducts.slice(0, 6); // Hiển thị chỉ 6 sản phẩm
    });
  }

  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
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
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sản phẩm vào Yêu thích.');
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
