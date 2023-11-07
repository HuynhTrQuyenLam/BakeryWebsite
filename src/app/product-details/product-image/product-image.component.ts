import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css']
})
export class ProductImageComponent {
  @Input() images: string[];
  largeImage: string;

  ngOnInit(): void {
    // if (this.images && this.images.length > 0) {
    //   alert("đã vô");
    //   this.largeImage = this.images[0]; 
    // }
  }

  showLargeImage(image: string): void {
    this.largeImage = image;
  }
}
