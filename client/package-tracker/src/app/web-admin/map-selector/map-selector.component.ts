import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-map-selector',
  template: '<div #map class="map-container"></div>',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') mapContainer!: ElementRef;
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  latitude = 0;
  longitude = 0;

  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitude, this.latitude],
      zoom: 3,
      accessToken: environment.mapboxAccessToken
    });

    this.map.getCanvas().style.cursor = 'pointer';

    this.map.on('click', (event) => {
      this.latitude = event.lngLat.lat;
      this.longitude = event.lngLat.lng;

      if (this.marker) {
        this.marker.remove();
      }

      this.marker = new mapboxgl.Marker(
        { color: 'green' }
      )
        .setLngLat([this.longitude, this.latitude])
        .addTo(this.map);

      this.locationSelected.emit({ lat: this.latitude, lng: this.longitude });
    });
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }
}
