import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
//import { NgChartsModule } from 'ng2-charts';

// Angular Material Modules
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

// Toastr for notifications
import { ToastrModule } from 'ngx-toastr';

// Core and Shared Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { ReservationModule } from './features/reservation/reservation.module';
import { PackModule } from './features/pack/pack.module';
import { DashboardModule } from './features/dashboard/dashboard.module';

// Components
import { AppComponent } from './app.component';
import { FooterComponent } from './layouts/main-layout/footer/footer.component';
//import { HeaderComponent } from './layouts/main-layout/header/header.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { TestimonialComponent } from './layouts/main-layout/testimonial/testimonial.component';
import { ServiceComponent } from './layouts/main-layout/service/service.component';
import { GuidesComponent } from './layouts/main-layout/guides/guides.component';
import { TransportComponent } from './layouts/main-layout/transport/transport.component';

import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActivityDetailsComponent } from './pages/activity-details/activity-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PaymentsComponent } from './pages/payments/payments/payments.component';

import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { LogementListFrontComponent } from './features/logement/components/logement-list-front/logement-list-front.component';
import { LogementDetailComponent } from './features/logement/components/logement-detail/logement-detail.component';
import { LogementStatsComponent } from './features/logement-stats/logement-stats.component';

// Services and Guards
import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth.guard';
import { JwtInterceptor } from './core/services/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    //HeaderComponent,
    AboutComponent,
    ServicesComponent,
    NotFoundComponent,
    MainLayoutComponent,
    HomeComponent,
    TestimonialComponent,
    ServiceComponent,
    GuidesComponent,
    TransportComponent,
    ActivityComponent,
    ActivityDetailsComponent,
    AuthDialogComponent,
    ProfileComponent,
    PaymentsComponent,
    //LoginComponent,
    //RegisterComponent,
    LogementListFrontComponent,
    LogementDetailComponent,
    LogementStatsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMapsModule,
    //NgChartsModule,
    // Angular Material
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
    // Toastr
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    // Feature Modules
    ReservationModule,
    PackModule,
    SharedModule,
    DashboardModule,
    //NgbModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}