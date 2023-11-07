import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-info-cmt',
  templateUrl: './product-info-cmt.component.html',
  styleUrls: ['./product-info-cmt.component.css']
})
export class ProductInfoCmtComponent {
  @Input() selectedProduct: any;
  selectedTab: string = 'productInfo';

  showContent(contentType: string) {
    this.selectedTab = contentType;
  }
}
