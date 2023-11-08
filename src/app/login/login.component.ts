import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  login() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
        // Xử lý sau khi đăng nhập thành công
        console.log('Đăng nhập thành công');

        // Lưu thông tin người dùng vào localStorage
        this.db.object(`/users/${userCredential.user?.uid}`).valueChanges()
          .subscribe((userData: any) => {
            localStorage.setItem('user', JSON.stringify(userData));
            // Ví dụ: Chuyển hướng người dùng đến trang sau khi đăng nhập thành công
            this.router.navigateByUrl('/');
          });
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Đăng nhập thất bại:', error);
        alert('Đăng nhập thất bại: ' + error.message);
      });
  }

  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }
}
