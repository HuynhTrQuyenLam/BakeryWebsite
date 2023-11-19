import { NgModule } from '@angular/core';
import { ProductService } from './product.service';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat'; 
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; 
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './home/about-us/about-us.component';
import { BestSellerComponent } from './home/best-seller/best-seller.component';
import { ContactComponent } from './home/contact/contact.component';
import { CommitComponent } from './home/commit/commit.component';
import { MemberComponent } from './home/member/member.component';
import { CategoryComponent } from './home/category/category.component';
import { MapsComponent } from './home/maps/maps.component';
import { MenuComponent } from './menu/menu.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductImageComponent } from './product-details/product-image/product-image.component';
import { DetailsComponent } from './product-details/details/details.component';
import { ProductInfoCmtComponent } from './product-details/product-info-cmt/product-info-cmt.component';
import { RelatedProductsComponent } from './product-details/related-products/related-products.component';
import { CartSidebarComponent } from './cart-sidebar/cart-sidebar.component';
import { FavoritesSidebarComponent } from './favorites-sidebar/favorites-sidebar.component';
import { CartComponent } from './cart/cart.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductFormComponentComponent } from './product-form-component/product-form-component.component'; 
import { OrderComponent } from './order/order.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BannerComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    BestSellerComponent,
    ContactComponent,
    CommitComponent,
    MemberComponent,
    CategoryComponent,
    MapsComponent,
    MenuComponent,
    ProductDetailsComponent,
    ProductImageComponent,
    DetailsComponent,
    ProductInfoCmtComponent,
    RelatedProductsComponent,
    CartSidebarComponent,
    FavoritesSidebarComponent,
    CartComponent,
    FavoritesComponent,
    RegisterComponent,
    LoginComponent,
    ProductFormComponentComponent,
    OrderComponent,
    PaymentComponent,
    OrderConfirmationComponent,
    OrderListComponent,
    OrderDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'cake'),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
