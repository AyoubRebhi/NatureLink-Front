import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

// Angular Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/main-layout/header/header.component';
import { FooterComponent } from './layouts/main-layout/footer/footer.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { TestimonialComponent } from './layouts/main-layout/testimonial/testimonial.component';
import { ServiceComponent } from './layouts/main-layout/service/service.component';
import { GuidesComponent } from './layouts/main-layout/guides/guides.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PaymentsComponent } from './pages/payments/payments/payments.component';
import { TransportComponent } from './layouts/main-layout/transport/transport.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActivityDetailsComponent } from './pages/activity-details/activity-details.component';

import { JwtInterceptor } from './core/services/jwt.interceptor';
import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth.guard';
import { ReservationModule } from './features/reservation/reservation.module';
import { PackModule } from './features/pack/pack.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ServicesComponent,
    NotFoundComponent,
    MainLayoutComponent,
    HomeComponent,
    TestimonialComponent,
    ServiceComponent,
    GuidesComponent,
    AuthDialogComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    PaymentsComponent,
    TransportComponent,
    ActivityComponent,
    ActivityDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatDividerModule,
    MatChipsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    ReservationModule,
    PackModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}