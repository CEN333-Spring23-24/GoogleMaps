import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MMapComponent } from '../../m-framework/components/m-map/m-map.component';
import { interval } from 'rxjs';

//@ts-ignore
declare var google; // Forward Declaration

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent, MMapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  map: any;
  initLat: number;
  initLng: number;
  initZoom: number;  
  lat: number; 
  lng: number; 
  zoom: number; 
  intValSub: any; 
  listOfMarkers: any[];
  listOfCircles: any[];
  counter:number = 0; 
  constructor() 
  {
    this.initLat = 0;
    this.initLng = 0;
    this.initZoom = 14; 
    this.lat = 0;
    this.lng = 0; 
    this.zoom = 0; 
    this.listOfMarkers = [];
    this.listOfCircles = [];
    
  }

  // Draw three random circles and a marker centered at your current locations
  useCase1()
  {
    navigator.geolocation.getCurrentPosition((data)=>{
      let lati = data.coords.latitude;
      let long = data.coords.longitude;
      this.dropMarker(lati,long);
      for(let i = 0 ; i < 3 ; i++)
      {
        let randomLat = lati + (Math.random()-0.5)*5*1/110.32;
        let randomLng = long + (Math.random()-0.5)*5*1/110.32;
        this.dropCircle(randomLat,randomLng, 500, true);
        
      }
    })
  }

  useCase2(){
    navigator.geolocation.watchPosition(()=>{
      navigator.geolocation.getCurrentPosition((data)=>{
        let lati = data.coords.latitude;
        let long = data.coords.longitude;
        this.dropCircle(lati,long,1000,false);
      })
    });
  }
  useCase3(){
    interval(10000).subscribe(()=>{
      this.counter+=1;
      navigator.geolocation.getCurrentPosition((data)=>{
        let lati = data.coords.latitude;
        let long = data.coords.longitude;
        if(this.counter%2==0)
          this.dropMarker(lati,long);
        else
          this.dropCircle(lati,long,1000,false);
      })
    })
  }

  drawMarker(latitude: number, longitude: number){
    let Marker = new google.maps.Marker({
      map: this.map,
      position: {lat: latitude, lng: longitude}
    });
    return Marker; 
  }
  drawCircle(latitude: number, longitude: number, radius: number, changable: boolean){
    let Circle = new google.maps.Circle({
      map: this.map,
      center: {lat: latitude, lng: longitude},
      radius: radius,
      editable: changable
    });
    return Circle; 
  }
  dropCircle(latitude: number, longitude: number, radius: number, changable:boolean){
    if(this.map)
    {
      let someCircle = this.drawCircle(latitude, longitude, radius, changable);
      this.listOfCircles.push(someCircle);
    }
  }
  dropMarker(latitude: number, longitude: number){
    if(this.map)
    {
      let someMarker = this.drawMarker(latitude, longitude);
      this.listOfMarkers.push(someMarker);
    }
  }
  zoomin(){
    this.initZoom +=1;
  }
  zoomout(){
    this.initZoom -=1;
  }
  getMapInstance(map: any) {
    this.map = map;
    this.listOfMarkers.forEach(element => {
      this.drawMarker(element.position.lat(), element.position.lng());
    });
    this.listOfCircles.forEach(element => {
      this.drawCircle(
        element.center.lat(), 
        element.center.lng(),
        element.radius,
        element.editable
      );
    });
  
    google.maps.event.addListener(this.map, 'click', 
      (event:any)=>{
        let latitude = event.latLng.lat();
        let longitude= event.latLng.lng();
        this.dropMarker(latitude,longitude);
        this.map.setCenter({lat: latitude, lng: longitude});
      });
    google.maps.event.addListener(this.map, 'dblclick', 
        (event:any)=>{
          let latitude = event.latLng.lat();
          let longitude= event.latLng.lng();
          this.dropCircle(latitude,longitude,100, true);
        });
  }
}


    /*
    this.intValSub = interval(5000).subscribe(()=>{
      this.zoom = this.zoom -1; 
    });
    */
  
  /*
  stopChanging(){
    this.intValSub.unsubscribe();
  }
   */