import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

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
// Feature Modules
import { ReservationModule } from './features/reservation/reservation.module';
import { PackModule } from './features/pack/pack.module';
import { DashboardModule } from './features/dashboard/dashboard.module';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/main-layout/header/header.component';
import { FooterComponent } from './layouts/main-layout/footer/footer.component';
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
//iheb
import { FilterByTitlePipe } from './shared01/pipes/filter-by-title.pipe';
import { FilterByDatePipe } from './shared01/pipes/filter-by-date.pipe';

// Post, Food, Clothing Components
import { PostFormComponent } from './features/Post/post-form/post-form.component';
import { PostListComponent } from './features/Post/post-list/post-list.component';
import { AddFoodComponent } from './features/Food/add-food/add-food.component';
import { AddClothingComponent } from './features/Clothing/add-clothing/add-clothing.component';
import { AddDestinationComponent } from './features/Destination/add-destination/add-destination.component';
import { ClothingListComponent } from './features/Clothing/clothing-list/clothing-list.component';
import { ListFoodComponent } from './features/Food/list-food/list-food.component';
import { UpdateFoodComponent } from './features/Food/update-food/update-food.component';
import { ListFoodClothingfrontComponent } from './features/Food/list-food-clothingfront/list-food-clothingfront.component';
import { UpdateClothingComponent } from './features/Clothing/update-clothing/update-clothing.component';
import { PostUserComponent } from './features/Post/post-user/post-user.component';
import { CarbonCalculatorComponent } from './features/CarbonCalculator/carbon-calculator/carbon-calculator.component';
import { SpeechComponent } from './speech/speech.component';
import { TraveComponent } from './features/travel/trave/trave.component';

// Services and Guards
import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth.guard';
import { JwtInterceptor } from './core/services/jwt.interceptor';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    //HeaderComponent,
    FooterComponent,
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
    LogementListFrontComponent,
    LogementDetailComponent,
    LogementStatsComponent,
    PostFormComponent,
    PostListComponent,
    AddFoodComponent,
    AddClothingComponent,
    AddDestinationComponent,
    ClothingListComponent,
    ListFoodComponent,
    UpdateFoodComponent,
    ListFoodClothingfrontComponent,
    UpdateClothingComponent,
    PostUserComponent,
    CarbonCalculatorComponent,
    SpeechComponent,
    TraveComponent
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
    //NgbModule, // <-- This is the correct import (from @ng-bootstrap/ng-bootstrap)
    PickerModule,

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
  bootstrap: [AppComponent]
})export class AppModule { }