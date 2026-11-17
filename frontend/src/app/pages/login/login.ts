
import {
  Component,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  onLogin(): void {

    if (this.isLoading) {
      return;
    }

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.auth.login({
      email: this.email.trim(),
      password: this.password
    })
    .pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({

      next: (response) => {

        if (response.role === 'Admin') {
          this.router.navigate(['/admin']);

        } else if (response.role === 'Staff') {
          this.router.navigate(['/staff']);

        } else {
          this.auth.logout();
          this.errorMessage = 'Unauthorized role';
          this.cdr.detectChanges();
        }
      },

      error: (err) => {

        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password';

        } else if (err.status === 0) {
          this.errorMessage =
            'Cannot connect to backend server';

        } else {
          this.errorMessage =
            'Login failed. Please try again.';
        }

        this.cdr.detectChanges();
      }

    });
  }
}
