import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesSidebarComponent } from './favorites-sidebar.component';

describe('FavoritesSidebarComponent', () => {
  let component: FavoritesSidebarComponent;
  let fixture: ComponentFixture<FavoritesSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritesSidebarComponent]
    });
    fixture = TestBed.createComponent(FavoritesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
