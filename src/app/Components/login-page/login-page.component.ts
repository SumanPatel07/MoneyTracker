
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  showEmailError = false;
  showPasswordError = false;
  isPasswordTooShort = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onEmailFocus() {
    this.showEmailError = false;
  }

  onEmailBlur(value: string) {
    this.showEmailError = !value.trim();
  }

  onPasswordFocus() {
    this.showPasswordError = false;
  }

  onPasswordBlur(value: string) {
    this.showPasswordError = !value.trim();
    this.isPasswordTooShort = value.trim().length > 0 && value.trim().length < 8;
  }

  onLoginButtonClicked(email: string, password: string) {
    if (this.showEmailError || this.showPasswordError || this.isPasswordTooShort) {
      console.error('Validation failed. Check email and password requirements.');
      return;
    }
  
    this.authService.login(email, password).subscribe({
      next: () => {
        // Check if the access token is valid
        this.authService.isAuthenticated().subscribe(isAuthenticated => {
          if (isAuthenticated) {
            this.router.navigate(['/lists']);
          } else {
            console.error('Authentication failed. Redirecting to login.');
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }
  
}
