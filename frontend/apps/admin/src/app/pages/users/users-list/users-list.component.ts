import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@lib/users';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
    users: User[] = [];

    constructor(
        private usersService: UsersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    getUsers(): void {
        this.usersService.getUsers().subscribe((users: User[]) => {
            this.users = users;

            if (users.length) {
                this.users.map((user: User) => {
                    user.country = user.country
                        ? this.usersService.getCountry(user.country)
                        : user.country;
                });
            }
        });
    }

    onDeleteConfirmation(userId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this User?',
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteUser(userId),
            reject: () => console.log('rejected')
        });
    }

    deleteUser(userId: string): void {
        this.usersService.deleteUser(userId).subscribe({
            next: (user: User) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `User ${user.name} is deleted`
                });

                this.getUsers();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'User is not deleted'
                });
            }
        });
    }

    onDeleteUser(userId: string) {
        this.onDeleteConfirmation(userId);
    }

    onEditUser(userId: string) {
        this.router.navigateByUrl(`users/form/${userId}`);
    }

    ngOnInit(): void {
        this.getUsers();
    }
}
