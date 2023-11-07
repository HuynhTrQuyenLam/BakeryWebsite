import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  @Input() selectedProduct: any;
  quantity: number = 1;
  addButtonHovered = false;

  addToCart(): void {
    // Hàm thêm sản phẩm vào giỏ hàng
    // Kiểm tra xem danh sách giỏ hàng đã tồn tại trong localStorage chưa
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.');
        return;
    }
    let cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex(product => product.id === this.selectedProduct.id);
  
    if (productIndex !== -1) {
      // If the product already exists in the cart, update the quantity and total
      cart[productIndex].quantity = (cart[productIndex].quantity || 1) + this.quantity;
      cart[productIndex].total = cart[productIndex].quantity * cart[productIndex].price;
    } else {
      // Thêm sản phẩm vào danh sách giỏ hàng
      this.selectedProduct.quantity = this.quantity;
      this.selectedProduct.total = this.selectedProduct.price; // Initial total for a new product
      cart.push(this.selectedProduct);
    }
  
    // Lưu danh sách giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Add cart success');
  }

  addToFavorites(): void{
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sản phẩm vào yêu thích.');
        return;
    }
    // Kiểm tra xem danh sách yêu thích đã tồn tại trong localStorage chưa
    let favorites: any[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isProductInFavorites = favorites.some(product => product.id === this.selectedProduct.id);

    if (!isProductInFavorites) {
      // Thêm sản phẩm vào danh sách yêu thích
      favorites.push(this.selectedProduct);
      // Lưu danh sách yêu thích vào localStorage
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert("Add favorites success");
    }else{
      alert("You have more favorite before that");
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  getRatingStars(rating: number): number[] {
    const roundedRating = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; 
    const stars: number[] = Array(5).fill(0).map((_, index) => {
      if (index < roundedRating) {
        return 1; // Sao đầy
      } else if (index === roundedRating && hasHalfStar) {
        return 0.5; // Nửa sao đầu tiên
      } else {
        return 0; // Sao rỗng
      }
    });
    return stars;
  }
  
  
}
