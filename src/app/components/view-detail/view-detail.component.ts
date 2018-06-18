import { Component, OnInit, AfterContentChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Observable } from 'rxjs/Observable';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.css']
})
export class ViewDetailComponent implements OnInit, AfterContentChecked {
  newsid;
  details: any;
  imagesUrl: any;
  isLoad = false;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  constructor(private route: ActivatedRoute, private hotelService: HotelService, private location: Location) { }
  
  ngOnInit() {
    let t: any;
    t = this.location;
    let id = t._platformStrategy._platformLocation.location.href.split('?id=')[1];
    this.hotelService.getNewsID(id).subscribe(news => {// lấy dữ liệu sách từ csdl
      this.details = news;
      this.isLoad = true;
      this.showPosition(Number(this.details.lat),Number(this.details.lng));
    });
    //get list img
    this.hotelService.getImgID(id).subscribe(lstimg => {
      this.imagesUrl = lstimg;
    });
    //khởi tạo map
    const myLatlng = new google.maps.LatLng(10.8454899, 106.7945204)
    var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
    // this.route.params.subscribe(params => {
    //   this.newsid = params["id"];// getid
    //   //get info news
    //   this.hotelService.getNewsID(this.newsid).subscribe(news => {// lấy dữ liệu sách từ csdl
    //     this.details = news;
    //     this.isLoad = true;
    //     this.showPosition(Number(this.details.lat),Number(this.details.lng));
    //   });
    //   //get list img
    //   this.hotelService.getImgID(this.newsid).subscribe(lstimg => {
    //     this.imagesUrl = lstimg;
    //   });
		// });
  }
  ngAfterContentChecked(){
    let elementMota : HTMLElement = document.getElementById('motathem') as HTMLElement;
    elementMota.innerHTML = this.details.motathem;
    console.log('View Init OK!');
  }
  showPosition(lat, lng) {
    let location = new google.maps.LatLng(Number(lat), Number(lng));
    this.map.panTo(location);// di chuyển tới vị trí marker
    //khởi tạo marker
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Đây là vị trí căn nhà!'
      });
    } else {
      this.marker.setPosition(location);
    }
  }
}
