import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import 'rxjs/add/operator/map';

import { AppComponent } from './app.component';

import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { ManageComponent } from './components/manage/manage.component';
import { FooterAdminComponent } from './components/footer-admin/footer-admin.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { HotelService } from './services/hotel.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import your library
import { OwlModule } from 'ngx-owl-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { NgxPaginationModule } from 'ngx-pagination';
import { AddnewsComponent } from './components/addnews/addnews.component';

import { ViewNewsComponent } from './components/view-news/view-news.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EditComponent } from './components/edit/edit.component';
import { ViewDetailComponent } from './components/view-detail/view-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    ManageComponent,
    NavbarAdminComponent,
    FooterAdminComponent,
    HotelsComponent,
    AddnewsComponent,
    ViewNewsComponent,
    ViewerComponent,
    FooterComponent,
    NavbarComponent,
    EditComponent,
    ViewDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    HttpClientModule,
    OwlModule,
    NgbModule.forRoot(),
    NgxPaginationModule,
    CKEditorModule
  ],
  providers: [HotelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
