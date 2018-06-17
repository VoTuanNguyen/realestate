import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  file: File = null;
  listImg = [];
  listfileImg = [];
  dem = 0;
  constructor(private hotelService: HotelService, private http: HttpClient) { }

  ngOnInit() {
  }
  onFileSelect(event: FileList) {
    let arr = this.listImg.length > 0 ? this.listImg : [];
    let arrfile = this.listfileImg.length > 0 ? this.listfileImg: [];
    let len = event.length;
    for (var i = 0; i < len; i++) {
      let tmpfile = {
        id: '',
        file:File = null
      };
      tmpfile.id = this.dem.toString();
      tmpfile.file = event.item(i);
      arrfile.push(tmpfile);

      this.file = event.item(i);
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
    }
    this.listfileImg = arrfile;
    this.listImg = arr;
  }
  Submit(){
    for(var i=0; i<this.listfileImg.length; i++){
      const fd = new FormData();
      
      fd.append('uploaded_file', this.listfileImg[i].file, this.listfileImg[i].file.name);
      console.log(fd);
      this.http.post("http://luciferwilling.ddns.net/realestate/upload_image.php", fd).subscribe(res => console.log(res));
    }
  }
}