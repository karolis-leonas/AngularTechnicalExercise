import { AddCountryDialogComponent } from './components/dialogs/add-country-dialog/add-country-dialog.component';
import { AddColumnDialogComponent } from './components/dialogs/add-column-dialog/add-column-dialog.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { MaterialModule } from './modules/material-module.module';
import { AppRoutingModule } from './modules/app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { fakeBackendProvider } from './helpers/fake-backend';
import { UserListComponent } from './components/user-list/user-list.component';
import { CdkColumnDef } from '@angular/cdk/table';
import { TableService } from './services/table.service';
import { AuthenticationService } from './services/authentication.service';
import { InactivityService } from './services/inactivity.service';
import { UserService } from './services/user.service';
import { ColumnDeleteConfirmationComponent } from './components/dialogs/column-delete-confirmation/column-delete-confirmation.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        NavigationMenuComponent,
        UserListComponent,
        AddColumnDialogComponent,
        AddCountryDialogComponent,
        ColumnDeleteConfirmationComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        CdkColumnDef,
        fakeBackendProvider,
        TableService,
        AuthenticationService,
        InactivityService,
        UserService
    ],
    bootstrap: [AppComponent],
    entryComponents: [AddColumnDialogComponent, AddCountryDialogComponent, ColumnDeleteConfirmationComponent]
})
export class AppModule { }
