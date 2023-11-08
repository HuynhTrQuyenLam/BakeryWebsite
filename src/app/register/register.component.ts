import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
        alert('Đăng ký thành công');

        this.db.object(`/users/${userCredential.user?.uid}`).set({
          username: this.username,
          email: this.email
        });
        this.router.navigateByUrl('/login');
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Đăng ký thất bại:', error);
        alert('Đăng ký thất bại: ' + error.message);
      });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
