import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'
import { } from '@types/googlemaps';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
@Injectable()
export class HotelsComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  // khai báo các biến
  hotelList;
  hotels;
  hotelsAsc;
  hotelsDesc;
  details;
  user;
  public imagesUrl;
  p;

  isDetail = false;

  tinhthanh;
  quanhuyen;
  district;
  isChooseCity = false;
  idCity = -1;
  isEmpty = false;
  idDistrict = -1;
  valueSort = -1;// -1 là mặc định
  isLoading = true;
  isFirst = true;
  unit = 1;

  constructor(private hotelService: HotelService, private router: Router, private httpService: HttpClient) {
  }
  ngOnInit() {
    //Lấy dữ liệu từ csdl
    this.hotelService.getAllNews().subscribe(hotelList => {
      this.hotelList = hotelList;
      this.isEmpty = this.hotelList.length === 0;// xác nhận là có hay là không có dữ liệu
      this.isLoading = false; // đã load xong
      this.hotels = hotelList;// để lưu lại thông tin toàn bộ khách sạn
    });
    // lấy danh sách phòng có giá giảm dần, tăng dần
    this.hotelService.getDescNews().subscribe(data => {
      this.hotelsDesc = data;
      let len = this.hotelsDesc.length;
      let arr = [];
      for (var i = len - 1; i >= 0; i--) {
        arr.push(this.hotelsDesc[i]);
      }
      this.hotelsAsc = arr;
    });

    this.imagesUrl = [{ "id": "1", "link": "https:\/\/nhatroservice.000webhostapp.com\/images\/20180425223824df.jpg" }];
    //khởi tạo map
    const myLatlng = new google.maps.LatLng(10.8454899, 106.7945204)
    var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);

    //lấy dữ liệu tỉnh thành và quận huyện đưa vào combobox
    this.hotelService.getCity().toPromise().then(data => {
      this.tinhthanh = data;
      this.tinhthanh = this.tinhthanh.thanhpho;
    });

    this.hotelService.getDistrict().subscribe(data => {
      this.quanhuyen = data;
      this.quanhuyen = this.quanhuyen.quanhuyen;
    });
  }
  onChange(value) {
    switch (value) {
      case 'default':
        this.valueSort = 1;
        this.filterPrice();
        break;
      case 'increase':
        this.valueSort = 2;
        this.filterPrice();
        break;
      case 'decrease':
        this.valueSort = 3;
        this.filterPrice();
        break;
      default:
        //
        this.valueSort = -1;
        break;
    }
  }
  filterArea() {
    switch (this.dientich) {
      case 1:
        this.filterDientich(0, 50);
        break;
      case 2:
        this.filterDientich(50, 100);
        break;
      case 3:
        this.filterDientich(100, 150);
        break;
      case 4:
        this.filterDientich(150, 200);
        break;
      case 5:
        this.filterDientich(200, 999999999);
        break;
      default:
        this.filterDientich(0, 99999999999);
        break;
    }
  }

  //
  filterPrice() {
    switch (this.khoanggia) {
      case 1:
        this.khoanggia = 1;
        this.filterAboutPrice(0, 500000000);
        break;
      case 2:
        this.khoanggia = 2;
        this.filterAboutPrice(500000000, 1000000000);
        break;
      case 3:
        this.khoanggia = 3;
        this.filterAboutPrice(1000000000, 1500000000);
        break;
      case 4:
        this.khoanggia = 4;
        this.filterAboutPrice(1500000000, 2000000000);
        break;
      case 5:
        this.khoanggia = 5;
        this.filterAboutPrice(2000000000, 999999999999999);
        break;
      default:
        this.filterAboutPrice(0, 999999999999999);
        break;
    }
  }
  public show(event): void {
    let id = event.target.getAttribute('name');

    //reset tab first
    let element: HTMLElement = document.getElementById('tabhead') as HTMLElement;
    element.click();
    // lấy thông tin phòng từ 
    var len = this.hotelList.length;
    for (var i = 0; i < len; i++) {
      if (this.hotelList[i].news.id == id) {
        this.details = this.hotelList[i].news;
        this.isDetail = true;

        if (this.details.gia / 1000000 > 1 && this.details.gia / 1000000 < 1000) {
          this.unit = 1000000;
        } else if (this.details.gia / 1000000000 > 1) {
          this.unit = 1000000000;
        }else{
          this.unit = 1;
        }

        let elementMota: HTMLElement = document.getElementById('motathem') as HTMLElement;
        elementMota.innerHTML = this.details.motathem;

        let lat = this.details.lat;
        let lng = this.details.lng;
        //hiển thị marker
        this.showPosition(lat, lng);

        // lấy danh sách hình về nhà trọ
        this.hotelService.getImgID(id).subscribe(lstimg => {
          this.imagesUrl = lstimg;
        });
        break;// dừng vòng lặp khi xuất hiện phần tử đầu tiên
      }
    }
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
  //thay đổi tỉnh thành phố
  onChangeCity(value) {
    switch (value) {
      case 'default':
        this.district = [];
        this.isChooseCity = false;// chưa chọn thành phố nên cb quận huyện sẽ bị disabled
        this.idCity = -1;
        this.filterPrice();
        break;
      default:
        this.idCity = value;
        this.filterPrice();
        this.isChooseCity = this.hotelList.length > 0;//nếu tỉnh này chưa có dữ liệu thì người dùng cũng không được chọn huyện        
        //đổ dữ liệu huyện tương ứng
        let arr = [];
        let len = this.quanhuyen.length;
        for (var i = 0; i < len; i++) {
          if (this.quanhuyen[i].idtp == value) {
            arr.push(this.quanhuyen[i]);
          }
        }
        this.district = arr;
        break;
    }
  }
  //thay đổi quận huyện
  onChangeDistrict(value) {
    switch (value) {
      case 'default':
        this.idDistrict = -1;
        this.filterPrice();
        break;
      default:
        this.idDistrict = value;
        this.filterPrice();
        break;
    }
  }
  dientich = -1;
  //thay đổi diện tích
  onChangeDientich(value) {
    switch (value) {
      case '1':
        this.dientich = 1;
        break;
      case '2':
        this.dientich = 2;
        break;
      case '3':
        this.dientich = 3;
        break;
      case '4':
        this.dientich = 4;
        break;
      case '5':
        this.dientich = 5;
        break;
      default:
        this.dientich = -1;
        break;
    }
    this.filterPrice();
  }
  filterDientich(min, max) {

    if (this.idCity == -1 && this.idDistrict == -1) {
      this.changeList();
    } else {
      if (this.idCity != -1) {
        if (this.idDistrict != -1) {
          this.filterPhongFromIdDistrict(this.idDistrict);
        } else {
          this.filterPhongFromIdCity(this.idCity);
        }
      }
    }

    let tmp = [];
    for (var i = 0; i < this.hotelList.length; i++) {
      if (Number(this.hotelList[i].news.dientich) >= min && Number(this.hotelList[i].news.dientich) < max) {
        tmp.push(this.hotelList[i]);
      }
    }
    this.hotelList = tmp;
  }
  changeList() {
    switch (this.valueSort) {
      case 1:
        this.hotelList = this.hotels
        break;
      case 2:
        this.hotelList = this.hotelsAsc;
        break;
      case 3:
        this.hotelList = this.hotelsDesc;
        break;
      default:
        this.hotelList = this.hotels// giá trị khởi tạo
        break;
    }
  }
  khoanggia = -1;
  //thay đổi khoản giá
  onChangeGia(value) {
    switch (value) {
      case '1':
        this.khoanggia = 1;
        this.filterAboutPrice(0, 500000000);
        break;
      case '2':
        this.khoanggia = 2;
        this.filterAboutPrice(500000000, 1000000000);
        break;
      case '3':
        this.khoanggia = 3;
        this.filterAboutPrice(1000000000, 1500000000);
        break;
      case '4':
        this.khoanggia = 4;
        this.filterAboutPrice(1500000000, 2000000000);
        break;
      case '5':
        this.khoanggia = 5;
        this.filterAboutPrice(2000000000, 999999999999999);
        break;
      default:
        this.khoanggia = -1;
        this.filterAboutPrice(0, 999999999999999);
        break;
    }
  }

  //
  filterAboutPrice(min, max) {
    //lọc theo diện tích
    this.filterArea();
    //lọc theo giá
    let tmp = [];
    for (var i = 0; i < this.hotelList.length; i++) {
      if (Number(this.hotelList[i].news.gia) >= min && Number(this.hotelList[i].news.gia) < max) {
        tmp.push(this.hotelList[i]);
      }
    }
    this.hotelList = tmp;
    this.isEmpty = this.hotelList.length == 0;
  }
  //tìm tin nằm trong tỉnh thành theo id
  filterPhongFromIdCity(id) {
    let arr, len, temp;
    arr = [];
    temp = [];
    len = this.hotels.length;
    switch (this.valueSort) {
      case 1:
        temp = this.hotels
        break;
      case 2:
        temp = this.hotelsAsc;
        break;
      case 3:
        temp = this.hotelsDesc;
        break;
      default:
        temp = this.hotels// giá trị khởi tạo
        break;
    }
    for (var i = 0; i < len; i++) {
      if (temp[i].news.idthanhpho == id) {
        arr.push(temp[i]);
      }
    }
    this.hotelList = arr;
  }
  //tìm tin nằm trong tỉnh thành theo id
  filterPhongFromIdDistrict(id) {
    let arr, len, temp;
    arr = [];
    temp = [];
    len = this.hotels.length;
    switch (this.valueSort) {
      case 1:
        temp = this.hotels
        break;
      case 2:
        temp = this.hotelsAsc;
        break;
      case 3:
        temp = this.hotelsDesc;
        break;
      default:
        temp = this.hotels// giá trị ban đầu
        break;
    }
    for (var i = 0; i < len; i++) {
      if (temp[i].news.idquanhuyen == id) {
        arr.push(temp[i]);
      }
    }
    this.hotelList = arr;
  }
  pageChange(event) {
    window.scrollTo(0, 400);
  }
}
