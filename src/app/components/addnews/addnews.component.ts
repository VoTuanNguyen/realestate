import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-addnews',
  templateUrl: './addnews.component.html',
  styleUrls: ['./addnews.component.css']
})
@Injectable()
export class AddnewsComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;
  file: File = null;
  listImg = [];
  listfileImg = [];
  dem = 0;
  tinhthanh;
  quanhuyen;
  district;

  constructor(private hotelService: HotelService, private http: HttpClient) { }

  title = '';
  type = '';
  hotelPrice = '';
  widthHotel = '';
  heigthHotel = '';
  detailAdress = '';
  nameBoss = '';
  facebookBoss = '';
  phoneBoss = '';
  hotelComfortable = '';
  hotelDescribe = '';
  hotellat = '';
  hotellng = '';
  emailBoss = '';
  idtp = '1';// giá trị mặc định
  idquanhuyen = '1';// giá trị mặc định
  isSaveLoad = false;

  ngOnInit() {
    //lấy dữ liệu tỉnh thành và quận huyện đưa vào combobox
    this.hotelService.getCity().subscribe(data => {
      this.tinhthanh = data;
      this.tinhthanh = this.tinhthanh.thanhpho;
    });

    this.hotelService.getDistrict().subscribe(data => {
      this.quanhuyen = data;
      this.quanhuyen = this.quanhuyen.quanhuyen;
      //Đổ dữ liệu cho cbb quận huyện
      let l = this.quanhuyen.length;
      this.district = [];
      for (var i = 0; i < l; i++) {
        if (this.quanhuyen[i].idtp == '1') {// Các quận huyện ở Hà Nội
          this.district.push(this.quanhuyen[i]);
        }
      }
    });
    // khởi tạo map
    const myLatlng = new google.maps.LatLng(10.8454899, 106.7945204)
    var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
    this.map.addListener('click', function (event) {
      localStorage.setItem('lat', event.latLng.lat());
      localStorage.setItem('lng', event.latLng.lng());
      localStorage.setItem('flag', 'true');
    });
  }
  clickMap() {
    if (localStorage.getItem('flag') == 'true') {
      localStorage.removeItem('flag');
      setTimeout(this.makeMarker(localStorage.getItem('lat'), localStorage.getItem('lng')), 500);
    }
  }
  onFileSelect(event: FileList) {
    let arr = this.listImg.length > 0 ? this.listImg : [];
    let arrfile = this.listfileImg.length > 0 ? this.listfileImg: [];
    let len = event.length;
    for (var i = 0; i < len; i++) {
      this.file = event.item(i);
      if (this.file.size / (1024 * 1024) < 1) {
        let tmpfile = {
          id: '',
          file:File = null
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
  onChangeCity(value) {
    this.idtp = value;
    let len = this.quanhuyen.length;
    this.district = [];
    for (var i = 0; i < len; i++) {
      if (this.quanhuyen[i].idtp == value) {
        this.district.push(this.quanhuyen[i]);
      }
    }
  }
  onChangeDistrict(value) {
    this.idquanhuyen = value;
  }
  autoCompleteCallback1(selectedData:any) {
    this.makeMarker(selectedData.data.geometry.location.lat, selectedData.data.geometry.location.lng);
  }
  makeMarker(lat, lng) {
    this.hotellat = lat;
    this.hotellng = lng;
    let location = new google.maps.LatLng(Number(lat), Number(lng));
    this.map.panTo(location);// di chuyển tới vị trí marker
    //khởi tạo marker
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Đây là vị trí phòng trọ!'
      });
    } else {
      this.marker.setPosition(location);
    }
  }

  //loại bỏ 1 ảnh khỏi list ảnh
  removeImg(ev) {
    const id = ev.path[1].lastElementChild.getAttribute('name');
    for (var i = 0; i < this.listImg.length; i++) {
      if (this.listImg[i].id == id) {
        this.listImg.splice(i, 1);
        this.listfileImg.splice(i, 1);
      }
    }
  }
  //
  checkTitle() {
    if (this.title.length === 0) {
      alert('Vui lòng nhập tiêu đề!');
      return false;
    }
    return true;
  }
  checkHotelPrice() {
    if (this.hotelPrice === '') {
      alert('Vui lòng nhập giá phù hợp!');
      return false;
    }
    return true;
  }
  checkWidthHotel() {
    if (this.widthHotel === '' || Number(this.widthHotel) < 1) {
      alert('Vui lòng nhập chiều rộng!');
      return false;
    }
    return true;
  }
  checkHeigthHotel() {
    if (this.heigthHotel === '' || Number(this.heigthHotel) < 1) {
      alert('Vui lòng nhập chiều dài!');
      return false;
    }
    return true;
  }
  checkHomeNumber() {
    if (this.detailAdress.length === 0) {
      alert('Vui lòng nhập số nhà!');
      return false;
    }
    return true;
  }
  checkLocation() {
    if (this.hotellat.length === 0 || this.hotellng.length === 0) {
      alert('Vui lòng chọn vị trí chính xác trên bản đồ!');
      return false;
    }
    return true;
  }
  checkNameBoss() {
    if (this.nameBoss.length === 0) {
      alert('Vui lòng họ tên!');
      return false;
    }
    return true;
  }
  checkPhoneBoss() {
    if (this.phoneBoss.length === 0) {
      alert('Vui lòng số điện thoại!');
      return false;
    }
    return true;
  }
  validateEmail(){
    if(this.emailBoss !== ''){
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(!filter.test(this.emailBoss)){
        alert('Vui lòng nhập đúng định dạng email!');
        return false;
      }
    }
    return true;
  }
  //thêm số 0 trước các số < 10
  AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }
  Submit() {
    // kiểm tra dữ liệu
    this.isSaveLoad = true;

    if (!this.checkTitle()) {
      return false;// stop
    }
    if (!this.checkHotelPrice()) {
      return false;
    }
    if (!this.checkWidthHotel()) {
      return false;
    }
    if (!this.checkHeigthHotel()) {
      return false;
    }
    if (!this.checkHomeNumber()) {
      return false;
    }
    if (!this.checkLocation()) {
      return false;
    }
    if (!this.checkNameBoss()) {
      return false;
    }
    if (!this.checkPhoneBoss()) {
      return false;
    }
    if (!this.validateEmail()) {
      return false;
    }

    //xử lý lại mảng hình ảnh trước khi gửi đi
    const img_lst = [];
    for (var i = 0; i < this.listImg.length; i++) {
      img_lst.push(this.listImg[i].img);// mảng chỉ chứa dữ liệu ảnh dạng base64
    }
    //Khởi tạo id tin theo tg và người đăng(ở đây là admin)
    var d = new Date();
    const id = 'nhadat' + d.getFullYear().toString() + this.AddZero(d.getMonth()).toString() + this.AddZero(d.getDate()).toString() +
      this.AddZero(d.getHours()).toString() + this.AddZero(d.getMinutes()).toString() + this.AddZero(d.getSeconds()).toString();
    
    let tentp = '';
    let tenquanhuyen = '';
    for (var i = 0; i < this.tinhthanh.length; i++) {
      if(this.tinhthanh[i].id === this.idtp){
        tentp = this.tinhthanh[i].tentp;
        break;
      }
    }
    for (var i = 0; i < this.quanhuyen.length; i++) {
      if(this.quanhuyen[i].id === this.idquanhuyen){
        tenquanhuyen = this.quanhuyen[i].tenquanhuyen;
        break;
      }
    }

    var data = {
      id: id,
      tieude: this.title,
      gia: Number(this.hotelPrice)*Number(this.unitMoney),
      diachi: this.detailAdress +", "+ tenquanhuyen +", "+ tentp,
      loaibds: this.type,
      dientich: Number(this.widthHotel) * Number(this.heigthHotel),
      chieudai: this.heigthHotel,
      chieurong: this.widthHotel,
      lat: this.hotellat,
      lng: this.hotellng,
      motathem: this.hotelDescribe,
      idtp: this.idtp,
      idquanhuyen: this.idquanhuyen,
      hoten: this.nameBoss,
      sdt: this.phoneBoss,
      facebook: this.facebookBoss,
      email: this.emailBoss
    }
    //B1: Tiến hành lưu tin xuống csdl và trả về thông báo thành công thất bại
    //B2: Tiến hành lưu ảnh lên host đồng thời lưu địa chỉ ảnh vào csdl theo id(khi tin đã lưu thành công)
    //B3: Thông báo lưu thành công

    //Lọc lấy mảng chứa ảnh

    this.hotelService.addNews(data).subscribe(res =>{
      if(res.text() === 'success'){
        //window.location.reload();// reload lại page để đăng tin khác
        // tiến hành up ảnh lên host và lưu vào csdl
        for(var i=0; i<this.listfileImg.length; i++){
          const fd = new FormData();
          const namefile = this.listfileImg[i].file.name.split('.')[0] + id + "." +this.listfileImg[i].file.name.split('.')[1];
          fd.append('uploaded_file', this.listfileImg[i].file, namefile);
          this.hotelService.uploadImgNews(fd).subscribe(result => {
            if(result.text() === 'ok'){
              this.hotelService.uploadURLImg(id, 'https://buonbannhadat.000webhostapp.com/images/'+namefile).subscribe(rs => console.log(rs));
            }
          });
        }
        let elementNotify : HTMLElement = document.getElementById('openmodal') as HTMLElement;
        elementNotify.click();
        this.isSaveLoad = false;
      }else{
        alert('Thêm tin thất bại!');
      }
    });
  }
  reload(){
    window.location.reload();
  }
  unitMoney = '1';
  onChangeUnitMoney(unit){
    this.unitMoney = unit;
  }
}
