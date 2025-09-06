import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  showEmailError = false; // Flag to show/hide the email error message
  showPasswordError = false; // Flag to show/hide the password error message

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onEmailFocus() {
    // Reset email error state when focused
    this.showEmailError = false;
  }

  onEmailBlur(value: string) {
    // Show email error if the input is empty when blurred
    this.showEmailError = !value.trim();
  }

  onPasswordFocus() {
    // Reset password error state when focused
    this.showPasswordError = false;
  }

  onPasswordBlur(value: string) {
    // Show password error if the input is empty when blurred
    this.showPasswordError = !value.trim();
  }

  onSignupButtonClicked(email: string, password: string) {
    // Ensure email and password are not empty
    if (!email || !password) {
      console.error('Email and password must not be empty');
      return;
    }

    this.authService.signup(email, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.router.navigate(['/app-main-page']);
    });
  }
}
