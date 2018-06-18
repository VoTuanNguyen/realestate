import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
interface ObjectJson {
  nameAttr: string[]
}
@Injectable()
export class HotelService {

  constructor(private http: Http, private httpClient: HttpClient) {
  }
  //lấy danh sách hotel
  //host = 'http://luciferwilling.ddns.net/realestate/';
  host = 'https://buonbannhadat.000webhostapp.com/';
  getAllNews() {
    let URL = this.host + "getAllNews.php";
    return this.httpClient.get(URL);
  }
  getImgID(id) {
    let URL = this.host + "getImgNewsID.php?id=" + id;
    return this.httpClient.get(URL);
  }
  deleteID(id) {
    let URL = this.host + "deleteNewsID.php?id=" + id;
    return this.http.get(URL);
  }
  getCity() {
    return this.httpClient.get('./assets/json/thanhpho.json');
  }
  getDistrict() {
    return this.httpClient.get('./assets/json/quanhuyen.json');
  }
  getDescNews() {
    let URL = this.host + "getDescNews.php";
    return this.httpClient.get(URL);
  }
  getLocation(key) {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({
      headers: headers
    });
    //https://cors-anywhere.herokuapp.com/
    let https = "https://cors-anywhere.herokuapp.com";
    let URL = https + "/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + key + "&key=AIzaSyC9hXBNhK5zuePc2RftV09n3Ao9IPE2tRA"
    return this.http.post(URL, options);
  }
  getAddress(key) {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({
      headers: headers
    });
    let https = "https://cors-anywhere.herokuapp.com";
    let url = https + "/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + key + "&types=geocode&language=vi&key=AIzaSyC9hXBNhK5zuePc2RftV09n3Ao9IPE2tRA";
    return this.http.post(url, options);
  }
  addNews(data) {
    let URL = this.host + "addNews.php";
    console.log(JSON.stringify({ data: data }));
    return this.http.post(URL, JSON.stringify({ data: data }));
  }
  uploadImgNews(fd) {
    let URL = this.host + "upload_image.php";
    return this.http.post(URL, fd);
  }
  uploadURLImg(id, link) {
    let URL = this.host + "upload_image_url.php?link=" + link + "&id=" + id;
    return this.http.get(URL);
  }
  getNewsID(id) {
    let URL = this.host + "get_news_id.php?id=" + id;
    return this.httpClient.get(URL);
  }
  updateInfoDetailNews(data) {
    let URL = this.host + "update_info_detail.php";
    return this.http.post(URL, JSON.stringify({ data: data }));
  }
  updateDecribeNews(data) {
    let URL = this.host + "update_motathem.php";
    console.log(JSON.stringify({ data: data }));
    return this.http.post(URL, JSON.stringify({ data: data }));
  }
  updateInfoContactNews(data) {
    let URL = this.host + "update_info_contact.php";
    console.log(JSON.stringify({ data: data }));
    return this.http.post(URL, JSON.stringify({ data: data }));
  }
  deleteImgID(id) {
    let URL = this.host + "delete_img_url.php?id=" + id;
    return this.http.get(URL);
  }
}