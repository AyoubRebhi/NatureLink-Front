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
import { PostFormComponent } from './post-form/post-form.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { PostListComponent } from './post-list/post-list.component';
import { AddFoodComponent } from './add-food/add-food.component';
import { AddClothingComponent } from './add-clothing/add-clothing.component';
import { AddDestinationComponent } from './add-destination/add-destination.component'; 

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
    PostFormComponent,
    PostListComponent,
    AddFoodComponent,
    AddClothingComponent,
    AddDestinationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule // Import HttpClientModule here²  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
