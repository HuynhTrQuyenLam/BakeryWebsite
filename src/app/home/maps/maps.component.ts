import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements AfterViewInit{
  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapOptions = {
      center: { lat: 10.776032, lng: 106.667362 },
      zoom: 10
    };

    const mapElement = document.getElementById('map');

    if (mapElement) {
      new google.maps.Map(mapElement, mapOptions);
    }
  }
}
