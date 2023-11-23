import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';

  constructor(private authService: AuthService,private notificationService:NotificationService, private router: Router) { }

  login(): void {
    this.authService.login(this.usernameOrEmail, this.password)
      .subscribe((loggedIn: boolean) => {
        if (loggedIn) {
          this.router.navigate(['/feed']);
          this.notificationService.showSuccess('Success');
        } else {
          this.notificationService.showError('Invalid Credentials Please check again');
        }
      });
  }
 
}
