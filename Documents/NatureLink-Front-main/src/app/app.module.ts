import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { MonumentDetailComponent } from './pages/home/monument-detail/monument-detail.component';
import { MonumentFrontComponent } from './pages/home/monument-front/monument-front.component';
import { RestaurantDetailComponent } from './pages/home/restaurant-detail/restaurant-detail.component';
import { RestoFrontComponent } from './pages/home/resto-front/resto-front.component';
import { VisitDetailComponent } from './pages/home/visit-detail/visit-detail.component';
import { VisitFrontComponent } from './pages/home/visit-front/visit-front.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { MenuModule } from './features/dashboard/menu/menu.module';
import { RestaurantModule } from './features/dashboard/restaurant/restaurant.module';
import { VisitModule } from './features/dashboard/visit/visit.module';

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
    HomeComponent,
    TestimonialComponent,
    ServiceComponent,
    NotFoundComponent,
    //
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    NotFoundComponent,
    RestoFrontComponent,
    RestaurantDetailComponent,
    MonumentFrontComponent,
    MonumentDetailComponent,
    VisitFrontComponent,
    VisitDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    //BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MenuModule,
    DashboardModule,
    VisitModule,
    RestaurantModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
