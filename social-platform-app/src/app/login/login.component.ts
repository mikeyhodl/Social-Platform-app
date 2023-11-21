import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.usernameOrEmail, this.password)
      .subscribe((loggedIn: boolean) => {
        if (loggedIn) {
          this.router.navigate(['/feed']);
        } else {
          console.log('Invalid credentials');
        }
      });
  }
 
}
