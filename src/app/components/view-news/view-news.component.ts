import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'
import { } from '@types/googlemaps';

@Component({
  selector: 'app-view-news',
  templateUrl: './view-news.component.html',
  styleUrls: ['./view-news.component.css']
})
@Injectable()
export class ViewNewsComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  hotelList;
  hotels;
  hotelsAsc;
  hotelsDesc;
  details;
  user;
  public imagesUrl;

  //
  isEditInfoDetail = false;
  isEditDecribe = false;
  isEditInfoContact = false;
  isEditImage = false;
  isEditMap = false;

  isDetail = false;

  tinhthanh;
  quanhuyen;
  tinhthanhedit;
  district;
  districtedit;
  isChooseCity = false;
  idCity = -1;
  isEmpty = false;
  idDistrict = -1;
  valueSort = -1;// -1 là mặc định
  isLoading = true;

  idtp = '';
  idquanhuyen = '';
  newaddress = '';
  motathem = '';
  hotelsTMP: any;
  update: any;
  gia;
  p;


  file: File = null;
  listImg = [];
  listfileImg = [];
  dem = 0;
  unitMoney = '1';


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
    this.hotelService.getAllNews().subscribe(hl => {
      this.hotelsTMP = hl;
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

    //map click
    this.map.addListener('click', function (event) {
      localStorage.setItem('lat', event.latLng.lat());
      localStorage.setItem('lng', event.latLng.lng());
      localStorage.setItem('flag', 'true');
    });

    //lấy dữ liệu tỉnh thành và quận huyện đưa vào combobox
    this.hotelService.getCity().subscribe(data => {
      this.tinhthanh = data;
      this.tinhthanh = this.tinhthanh.thanhpho;
      this.tinhthanhedit = this.tinhthanh;
    });

    this.hotelService.getDistrict().subscribe(data => {
      this.quanhuyen = data;
      this.quanhuyen = this.quanhuyen.quanhuyen;
    });
  }
  //click map and create marker
  clickMap() {
    if (localStorage.getItem('flag') == 'true' && this.isEditMap) {
      localStorage.removeItem('flag');
      //Lưu vị trí mới vào update
      this.update.lat = localStorage.getItem('lat');
      this.update.lng = localStorage.getItem('lng');
      setTimeout(this.showPosition(localStorage.getItem('lat'), localStorage.getItem('lng')), 500);
    }
  }
  keysearch;
  clickSearch(event) {
    let key = event.target.getAttribute('id');
    this.keysearch = key.split('&text=')[1];
    this.address = [];
    let id = key.split('&text=')[0];
    this.hotelService.getLocation(id).subscribe(data => {
      this.showPosition(data.json().result.geometry.location.lat, data.json().result.geometry.location.lng);
    });
  }
  address = [];
  onSearchChange(value) {
    this.address = [];
    let temp = [];
    let arr = {
      text: '',
      placeid: ''
    }
    if (value.length !== 0) {
      this.hotelService.getAddress(value).subscribe(data => {
        temp = data.json().predictions;
        for (var i = 0; i < temp.length; i++) {
          arr.text = temp[i].description;
          arr.placeid = temp[i].place_id;
          this.address.push(arr);
        }
      });
    }
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
  tinhthanhselected: any;
  quanhuyenselected: any;
  public show(event): void {
    this.isEditDecribe = false;
    this.isEditInfoContact = false;
    this.isEditInfoDetail = false;
    this.isEditImage = false;
    this.isEditMap = false;
    let id = event.target.getAttribute('name');
    //reset tab first
    let element: HTMLElement = document.getElementById('tabhead') as HTMLElement;
    element.click();

    // lấy thông tin phòng từ 
    var len = this.hotels.length;
    let arrtmp = this.hotels;
    for (var i = 0; i < len; i++) {
      if (arrtmp[i].news.id == id) {
        this.details = arrtmp[i].news;
        this.isDetail = true;
        this.update = this.hotelsTMP[i].news;

        let elementMota: HTMLElement = document.getElementById('motathem') as HTMLElement;
        elementMota.innerHTML = this.details.motathem;

        //convert giá
        if (this.details.gia / 1000000 > 1 && this.details.gia / 1000000 < 1000) {
          this.unitMoney = '1000000';
          this.unit = '1000000';
        } else if (this.details.gia / 1000000000 > 1) {
          this.unitMoney = '1000000000';
          this.unit = '1000000000';
        } else {
          this.unitMoney = '1';
          this.unit = '1';
        }
        this.gia = Number(this.update.gia) / Number(this.unitMoney);

        let lat = this.details.lat;
        let lng = this.details.lng;
        //hiển thị marker
        this.showPosition(lat, lng);

        // lấy danh sách hình về nhà trọ
        this.hotelService.getImgID(id).subscribe(lstimg => {
          this.imagesUrl = lstimg;
        });

        //
        this.idtp = this.details.idthanhpho;
        this.idquanhuyen = this.details.idquanhuyen;
        this.newaddress = this.details.diachi.split(',')[0];
        this.motathem = this.details.motathem;

        let l = this.quanhuyen.length;
        this.districtedit = [];
        for (var i = 0; i < l; i++) {
          if (this.quanhuyen[i].idtp == this.details.idthanhpho) {
            this.districtedit.push(this.quanhuyen[i]);
          }
        }
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
    window.scrollTo(0, 0);
  }
  public idnews;
  //openmodal xóa
  delete(event) {
    this.idnews = event.target.getAttribute('name');
  }
  //xác nhận xóa
  confirmDelete() {
    this.hotelService.deleteID(this.idnews).subscribe(mess => {
      if (mess.text() == 'Success') {
        for (var i = 0; i < this.hotelList.length; i++) {
          if (this.hotelList[i].news.id == this.idnews) {//loại phòng vừa xóa ra khỏi danh sách
            this.hotelList.splice(i, 1);
          }
        }
      }
    });
  }
  onChangeCityEdit(value) {
    this.idtp = value;
    let len = this.quanhuyen.length;
    this.districtedit = [];
    for (var i = 0; i < len; i++) {
      if (this.quanhuyen[i].idtp == value) {
        this.districtedit.push(this.quanhuyen[i]);
      }
    }
  }
  onChangeDistrictEdit(value) {
    this.idquanhuyen = value;
  }
  onChangeText(value) {
    this.newaddress = value;
  }
  saveInfoDetailUpdate() {
    let tentp = '';
    let tenquanhuyen = '';
    for (var i = 0; i < this.tinhthanh.length; i++) {
      if (this.tinhthanh[i].id === this.idtp) {
        tentp = this.tinhthanh[i].tentp;
        break;
      }
    }
    for (var i = 0; i < this.quanhuyen.length; i++) {
      if (this.quanhuyen[i].id === this.idquanhuyen) {
        tenquanhuyen = this.quanhuyen[i].tenquanhuyen;
        break;
      }
    }
    this.update.diachi = this.newaddress + ", " + tenquanhuyen + ", " + tentp;
    this.update.dientich = Number(this.update.chieudai) * Number(this.update.chieurong);
    this.update.idthanhpho = this.idtp;
    this.update.idquanhuyen = this.idquanhuyen;
    this.hotelService.updateInfoDetailNews(this.update).subscribe(res => {
      if (res.text() === 'success') {
        this.updateTodetail();
        this.unitMoney = this.unit;
        //cập nhật dữ liệu trên website
        for (var i = 0; i < this.hotelList.length; i++) {
          if (this.hotelList[i].news.id === this.details.id) {
            this.hotelList[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsAsc.length; i++) {
          if (this.hotelsAsc[i].news.id === this.details.id) {
            this.hotelsAsc[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsDesc.length; i++) {
          if (this.hotelsDesc[i].news.id === this.details.id) {
            this.hotelsDesc[i].news = this.details;
            break;
          }
        }
        //Chuyển lại ben tình trạng xem tin
        this.isEditInfoDetail = !this.isEditInfoDetail;
      } else {
        alert('Cập nhật thất bại!');
      }
    });
  }

  //
  saveDecribeUpdate() {
    this.details.motathem = this.motathem;
    this.hotelService.updateDecribeNews(this.details).subscribe(res => {
      if (res.text() === 'success') {
        this.updateTodetail();
        let elementMota: HTMLElement = document.getElementById('motathem') as HTMLElement;
        elementMota.innerHTML = this.motathem;
        //cập nhật dữ liệu trên website
        for (var i = 0; i < this.hotelList.length; i++) {
          if (this.hotelList[i].news.id === this.details.id) {
            this.hotelList[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsAsc.length; i++) {
          if (this.hotelsAsc[i].news.id === this.details.id) {
            this.hotelsAsc[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsDesc.length; i++) {
          if (this.hotelsDesc[i].news.id === this.details.id) {
            this.hotelsDesc[i].news = this.details;
            break;
          }
        }
        //Chuyển lại ben tình trạng xem tin
        this.isEditDecribe = !this.isEditDecribe;
      } else {
        for (var i = 0; i < this.hotelsAsc.length; i++) {
          if (this.hotelsAsc[i].news.id === this.details.id) {
            this.details = this.hotelsAsc[i].news;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelList.length; i++) {
          if (this.hotelList[i].news.id === this.details.id) {
            this.hotelList[i].news = this.details;
            break;
          }
        }
        alert('Cập nhật thất bại!');
      }
    });
  }
  //
  saveInfoContactUpdate() {
    this.hotelService.updateInfoContactNews(this.details).subscribe(res => {
      if (res.text() === 'success') {
        this.updateTodetail();
        //cập nhật dữ liệu trên website
        for (var i = 0; i < this.hotelList.length; i++) {
          if (this.hotelList[i].news.id === this.details.id) {
            this.hotelList[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsAsc.length; i++) {
          if (this.hotelsAsc[i].news.id === this.details.id) {
            this.hotelsAsc[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsDesc.length; i++) {
          if (this.hotelsDesc[i].news.id === this.details.id) {
            this.hotelsDesc[i].news = this.details;
            break;
          }
        }
        //Chuyển lại ben tình trạng xem tin
        this.isEditInfoContact = !this.isEditInfoContact;
      } else {
        alert('Cập nhật thất bại!');
      }
    });
  }
  //
  canleUpdate() {
    this.showPosition(this.details.lat, this.details.lng);
    this.address = [];
  }

  //Đổ mảng update qua mảng details
  updateTodetail() {
    this.details.tieude = this.update.tieude;
    this.details.loaibds = this.update.loaibds;
    this.details.dientich = this.update.dientich;
    this.details.chieudai = this.update.chieudai;
    this.details.chieurong = this.update.chieurong;
    this.details.diachi = this.update.diachi;
    this.details.gia = this.update.gia;
    this.details.lat = this.update.lat;
    this.details.lng = this.update.lng;
    this.details.motathem = this.update.motathem;
    this.details.hoten = this.update.hoten;
    this.details.sdt = this.update.sdt;
    this.details.email = this.update.email;
    this.details.facebook = this.update.facebook;
  }

  updateListImg() {
    this.listImg = [];
    for (var i = 0; i < this.imagesUrl.length; i++) {
      let tmp = {
        id: this.imagesUrl[i].id,
        img: this.imagesUrl[i].link
      };
      this.listImg.push(tmp);
    }
  }
  editImg() {
    this.updateListImg();
  }
  //loại bỏ 1 ảnh khỏi list ảnh
  removeImg(ev) {
    const id = ev.path[1].lastElementChild.getAttribute('name');
    for (var i = 0; i < this.listImg.length; i++) {
      if (this.listImg[i].id === id) {
        this.listImg.splice(i, 1);
        this.hotelService.deleteImgID(id).subscribe(res => {
          if (res.text() === 'ok') {
            console.log('OKKO');
          }
        });
      }
      if (this.imagesUrl[i].id === id) {
        this.imagesUrl.splice(i, 1);
      }
    }
  }
  //
  onFileSelect(event: FileList) {
    let arr = this.listImg.length > 0 ? this.listImg : [];
    let arrfile = this.listfileImg.length > 0 ? this.listfileImg : [];
    let len = event.length;
    for (var i = 0; i < len; i++) {
      this.file = event.item(i);
      if (this.file.size / (1024 * 1024) < 1) {
        let tmpfile = {
          id: '',
          file: File = null
        };
        tmpfile.id = this.dem.toString();
        tmpfile.file = event.item(i);
        arrfile.push(tmpfile);

        var reader = new FileReader();
        reader.onload = (ev: any) => {
          let temp = {
            id: '',
            img: ''
          };
          temp.id = this.dem.toString();
          temp.img = ev.target.result;
          arr.push(temp);
          this.dem++;
        }
        reader.readAsDataURL(this.file);
      } else {
        alert('Vui lòng chọn những file ảnh có dung lượng nhỏ hơn 1MB!');
      }
    }
    this.listfileImg = arrfile;
    this.listImg = arr;
  }
  //
  saveImageUpdate() {
    for (var i = 0; i < this.listfileImg.length; i++) {
      const fd = new FormData();
      const namefile = this.listfileImg[i].file.name.split('.')[0] + this.details.id + "." + this.listfileImg[i].file.name.split('.')[1];
      fd.append('uploaded_file', this.listfileImg[i].file, namefile);
      this.hotelService.uploadImgNews(fd).subscribe(result => {
        if (result.text() === 'ok') {
          this.hotelService.uploadURLImg(this.details.id, 'https://buonbannhadat.000webhostapp.com/images/' + namefile).subscribe(rs => {
            let tmp = {
              id: this.details.id + i,
              link: 'https://buonbannhadat.000webhostapp.com/images/' + namefile
            };
            this.imagesUrl.push(tmp);
          });
        }
      });
    }

  }
  //
  saveMapUpdate() {
    this.hotelService.updateInfoDetailNews(this.update).subscribe(res => {
      if (res.text() === 'success') {
        this.updateTodetail();
        //cập nhật dữ liệu trên website
        for (var i = 0; i < this.hotelList.length; i++) {
          if (this.hotelList[i].news.id === this.details.id) {
            this.hotelList[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsAsc.length; i++) {
          if (this.hotelsAsc[i].news.id === this.details.id) {
            this.hotelsAsc[i].news = this.details;
            break;
          }
        }
        //
        for (var i = 0; i < this.hotelsDesc.length; i++) {
          if (this.hotelsDesc[i].news.id === this.details.id) {
            this.hotelsDesc[i].news = this.details;
            break;
          }
        }
        //Chuyển lại ben tình trạng xem tin
        this.isEditMap = !this.isEditMap;
      } else {
        alert('Cập nhật thất bại!');
      }
    });
  }
  unit = '1';
  onChangeUnitMoney(unit) {
    this.unit = unit;
    this.update.gia = Number(unit) * Number(this.valuePrice);
  }
  valuePrice = '1';
  onChangePrice(value) {
    this.update.gia = Number(this.unit) * Number(value);
    this.valuePrice = value;
  }
}

