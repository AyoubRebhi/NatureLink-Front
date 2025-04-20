import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { ActivityDetailsComponent } from './pages/activity-details/activity-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';


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
    ActivityDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatDividerModule,
    MatChipsModule,      // ✅ this enables ngModel

  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
