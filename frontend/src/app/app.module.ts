import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainmenuModule } from './components/mainmenu/mainmenu.module';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FieldsComponent } from './components/fields/fields.component';
import { SignInModule } from './pages/sign-in/sign-in.module';
import { AuthInterceptor } from './interceptor/auth-interceptor.interceptor';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { SidebarModule } from 'primeng/sidebar';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FieldsComponent,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MainmenuModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastModule,
    SignInModule,
    ButtonModule,
    BadgeModule,
    SidebarModule,
    NotificationComponent,
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
