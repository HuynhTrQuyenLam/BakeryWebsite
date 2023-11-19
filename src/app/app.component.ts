import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'angular-complete';
  isCartSidebarOpen: boolean = false;
  isFaSidebarOpen: boolean = false;

  openCartSidebar(): void {
    this.isCartSidebarOpen = true;
  }

  openFaSidebar(): void {
    this.isFaSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isCartSidebarOpen = false;
    this.isFaSidebarOpen = false; 
  }

  // Chuyển sang trang LOGIN
  isLoginRoute = false;
  isRegisterRoute = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = this.router.url === '/login';
        this.isRegisterRoute = this.router.url === '/register';
      }
    });
  }

}
