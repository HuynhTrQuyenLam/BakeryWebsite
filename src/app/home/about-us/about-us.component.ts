import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.addFadeInClassOnScroll();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.addFadeInClassOnScroll();
  }

  private isElementInViewport(element: any) {
    var rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private addFadeInClassOnScroll() {
    const elements = this.elementRef.nativeElement.querySelectorAll('.fade-in');

    elements.forEach((element: any) => {
      if (this.isElementInViewport(element)) {
        element.classList.add('fade-in-visible');
      } else {
        element.classList.remove('fade-in-visible');
      }
    });
  }
}