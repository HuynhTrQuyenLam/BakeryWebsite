import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  selectedProduct: any;
  quantity: number = 1;
  largeImage: string;

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id']; 
      console.log(productId);
      this.db.object(`products/${productId}`).valueChanges().subscribe((product: any) => {
        console.log(product);
        const data = {
          id: product.id,
          title: product.title,
          price: product.price,
          category: product.category,
          ingredients: product.ingredients,
          description: product.description,
          images: [product.image, product.image, product.image],
          rating: product.rating
        }
        this.selectedProduct = data;
      });
    });
  }

  showLargeImage(image: string): void {
    this.largeImage = image;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

}
