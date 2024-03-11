import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapboxLoaderService {
  private mapboxScriptLoaded = false;

  loadMapbox(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.mapboxScriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
      script.async = true;
      script.onload = () => {
        this.mapboxScriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Mapbox GL JS'));
      };
      document.body.appendChild(script);

      const timeout = setTimeout(() => {
        reject(new Error('Mapbox GL JS script loading timed out'));
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
    });
  }
}