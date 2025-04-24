import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

import { VisitDetailComponent } from './pages/home/visit-detail/visit-detail.component';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { RestaurantModule } from './features/dashboard/restaurant/restaurant.module';
import { VisitModule } from './features/dashboard/visit/visit.module';
import { MenuModule } from './features/dashboard/menu/menu.module';
import { SharedModule } from './shared/pipes/shared.module';
import { MonumentFrontComponent } from './pages/Monument/monument-front/monument-front.component';


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


    VisitDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    DashboardModule,
    RestaurantModule,
    VisitModule,
    MenuModule,
   
    SharedModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
