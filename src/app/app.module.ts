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
  import { HttpClientModule } from '@angular/common/http';
  import { TransportComponent } from './layouts/main-layout/transport/transport.component';
  import { FormsModule } from '@angular/forms';
  import { ActivityComponent } from './pages/activity/activity.component';


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
      TransportComponent,
      ActivityComponent,
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      NgbModule,
      HttpClientModule,
      FormsModule,      // ✅ this enables ngModel

    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
