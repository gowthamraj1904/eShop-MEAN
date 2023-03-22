import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ShellComponent,
        SideBarComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking'
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
