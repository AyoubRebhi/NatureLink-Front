import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export class YourModule { }
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
import { PostFormComponent } from './features/Post/post-form/post-form.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Add this import
import { ListFoodComponent } from './features/Food/list-food/list-food.component';
import { HttpClientModule } from '@angular/common/http';
import { PostListComponent } from './features/Post/post-list/post-list.component';
import { AddFoodComponent } from './features/Food/add-food/add-food.component';
import { AddClothingComponent } from './features/Clothing/add-clothing/add-clothing.component';
import { AddDestinationComponent } from './features/Destination/add-destination/add-destination.component';
import { ClothingListComponent } from './features/Clothing/clothing-list/clothing-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { UpdateFoodComponent } from './features/Food/update-food/update-food.component';
import { ListFoodClothingfrontComponent } from './features/Food/list-food-clothingfront/list-food-clothingfront.component';
import { UpdateClothingComponent } from './features/Clothing/update-clothing/update-clothing.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PostUserComponent } from './features/Post/post-user/post-user.component';

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
    ClothingListComponent,
    ListFoodComponent,
    UpdateFoodComponent,
    ListFoodClothingfrontComponent,
    UpdateClothingComponent,
    PostUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    PickerModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule ,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })// Import HttpClientModule here²  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
