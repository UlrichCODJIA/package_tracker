import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'package-tracker';
  renderer: Renderer2;
  constructor(
    private rendererFactory: RendererFactory2,
    private router: Router
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        this.changeBodyBgColor(currentUrl);
      }
    });
  }

  changeBodyBgColor(currentUrl: string) {
    const body = document.body;
    this.renderer.setStyle(body, 'background-color', '');
    switch (currentUrl) {
      case '/driver':
        this.renderer.setStyle(body, 'background-color', '#FCE5CD');
        break;
      default:
        this.renderer.setStyle(body, 'background-color', '#D9EAD3');
    }
  }
}
