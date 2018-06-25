// import { Component } from '@angular/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps'; 
import { Http, Response, Headers, RequestOptions } from '@angular/http';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }
  autoCompleteCallback1(selectedData:any) {
    console.log(selectedData);
  }
}
