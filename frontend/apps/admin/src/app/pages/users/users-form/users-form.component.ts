import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@lib/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'admin-users-form',
    templateUrl: './users-form.component.html',
    styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit, OnDestroy {
    form: FormGroup;

    isSubmitted = false;

    isEditMode = false;

    countries: Record<string, string>[] = [];

    private userId: string;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private usersService: UsersService
    ) {}

    private createForm(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            phone: ['', Validators.required],
            street: ['', Validators.required],
            apartment: ['', Validators.required],
            city: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['', Validators.required],
            isAdmin: [false]
        });
    }

    private checkEditMode(): void {
        this.route.params
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((params: any) => {
                if (params?.userId) {
                    this.isEditMode = true;
                    this.userId = params?.userId;
                    this.getUserById(this.userId);
                }
            });
    }

    private getCountries(): void {
        this.countries = this.usersService.getCountries();
    }

    private getUserById(userId: string): void {
        this.usersService
            .getUserById(userId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((user: User) => {
                this.form.patchValue({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    street: user.street,
                    apartment: user.apartment,
                    city: user.city,
                    zip: user.zip,
                    country: user.country,
                    isAdmin: user.isAdmin
                });

                this.form.controls['password'].setValidators([]);
                this.form.get('password')?.updateValueAndValidity();
            });
    }

    private createUser(user: User): void {
        this.usersService
            .createUsers(user)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (user: User) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `User ${user.name} is created`
                    });

                    timer(2000)
                        .pipe(takeUntil(this.endSubscription$))
                        .subscribe(() => {
                            this.location.back();
                        });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'User is not created'
                    });
                }
            });
    }

    private updateUser(user: User): void {
        this.usersService
            .updateUser(user)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (user: User) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `User ${user.name} is updated`
                    });

                    timer(2000)
                        .pipe(takeUntil(this.endSubscription$))
                        .subscribe(() => {
                            this.location.back();
                        });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'User is not updated'
                    });
                }
            });
    }

    onSubmit(): void {
        this.isSubmitted = true;

        if (this.form.invalid) {
            return;
        }

        const user: User = {
            id: this.userId,
            name: this.form.get('name')?.value,
            email: this.form.get('email')?.value,
            password: this.form.get('password')?.value,
            phone: this.form.get('phone')?.value,
            street: this.form.get('street')?.value,
            apartment: this.form.get('apartment')?.value,
            city: this.form.get('city')?.value,
            zip: this.form.get('zip')?.value,
            country: this.form.get('country')?.value,
            isAdmin: this.form.get('isAdmin')?.value
        };

        if (this.isEditMode) {
            this.updateUser(user);
        } else {
            this.createUser(user);
        }
    }

    onCancel(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.createForm();
        this.checkEditMode();
        this.getCountries();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
