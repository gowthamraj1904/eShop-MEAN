import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@lib/users';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
    selector: 'admin-users-form',
    templateUrl: './users-form.component.html',
    styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {
    form: FormGroup;
    isSubmitted = false;
    isEditMode = false;
    userId: string;
    countries: Record<string, string>[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    createForm(): void {
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

    checkEditMode(): void {
        this.route.params.subscribe((params: any) => {
            if (params?.userId) {
                this.isEditMode = true;
                this.userId = params?.userId;
                this.getUserById(this.userId);
            }
        });
    }

    getCountries(): void {
        this.countries = this.usersService.getCountries();
    }

    getUserById(userId: string): void {
        this.usersService.getUserById(userId).subscribe((user: User) => {
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

    createUser(user: User): void {
        this.usersService.createUsers(user).subscribe({
            next: (user: User) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `User ${user.name} is created`
                });

                timer(2000).subscribe(() => {
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

    updateUser(user: User): void {
        this.usersService.updateUser(user).subscribe({
            next: (user: User) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `User ${user.name} is updated`
                });

                timer(2000).subscribe(() => {
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

    onCancel(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.createForm();
        this.checkEditMode();
        this.getCountries();
    }
}
