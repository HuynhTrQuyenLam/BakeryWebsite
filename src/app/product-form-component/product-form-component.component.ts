import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-product-form-component',
  templateUrl: './product-form-component.component.html',
  styleUrls: ['./product-form-component.component.css']
})
export class ProductFormComponentComponent {
  category: string = 'PETIT';
  title: string = '';
  price: string = '';
  description: string = '';
  ingredients: string = '';
  rating: string = '';
  imageFile: any; // Biến để lưu hình ảnh sản phẩm

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  // Hàm xử lý khi người dùng chọn hình ảnh
  onImageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
    }
  }

  // Hàm xử lý lưu thông tin sản phẩm
  saveProduct() {
    const productData = {
      category: this.category,
      title: this.title,
      price: this.price,
      description: this.description,
      ingredients: this.ingredients,
      rating: this.rating,
      // Thêm trường image vào model sản phẩm
      image: ''
    };

    // Tải lên hình ảnh lên Firebase Storage
    const filePath = `product_images/${this.imageFile.name}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.imageFile).then(() => {
      // Lấy URL hình ảnh sau khi tải lên thành công
      fileRef.getDownloadURL().subscribe((url: string) => {
        // Lưu URL hình ảnh vào thông tin sản phẩm
        productData.image = url;

        // Tạo sản phẩm mới trong bảng "products" của Realtime Database
        const newProductRef = this.db.list('/products').push(productData);
        const newProductId = newProductRef.key; // Lấy key (id) của sản phẩm được sinh tự động

        // Lưu trường id vào dữ liệu của sản phẩm
        this.db.object(`/products/${newProductId}`).update({ id: newProductId })
          .then(() => {
            console.log('Sản phẩm đã được lưu thành công');
          })
          .catch(error => {
            console.error('Lưu sản phẩm thất bại:', error);
          });
      });
    });
  }
}
