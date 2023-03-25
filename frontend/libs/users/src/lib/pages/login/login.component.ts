import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Login } from '@lib/users';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    form: FormGroup;

    isSubmitted = false;

    isAuthError = false;

    authErrorMessage: string;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {}

    private createForm(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onLogin(): void {
        this.isSubmitted = true;
        this.isAuthError = false;

        if (this.form.invalid) {
            return;
        }

        const loginData = {
            email: this.form.get('email')?.value,
            password: this.form.get('password')?.value
        };

        this.authService
            .login(loginData.email, loginData.password)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (response: Login) => {
                    this.localStorageService.setToken(response.token);
                    this.router.navigate(['/']);
                },
                error: (error: HttpErrorResponse) => {
                    this.isAuthError = true;

                    if (error.status !== 400) {
                        this.authErrorMessage =
                            'Error in the server, please try again later';
                    } else {
                        this.authErrorMessage = 'Email or Password are wrong';
                    }
                }
            });
    }

    ngOnInit(): void {
        this.createForm();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
