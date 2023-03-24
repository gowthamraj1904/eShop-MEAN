import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { usersRoutes } from './lib.routes';
import { LoginComponent } from './pages/login/login.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@lib/users';
import { LocalstorageService } from './services/localstorage.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(usersRoutes),
        InputTextModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [LoginComponent],
    providers: [AuthService, LocalstorageService]
})
export class UsersModule {}
