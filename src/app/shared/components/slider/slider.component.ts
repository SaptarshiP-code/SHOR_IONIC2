import { Component, OnInit,Input  } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [ NgbCarouselConfig,NgbCarousel ]
})
export class SliderComponent implements OnInit {
  @Input() slides: any;
  constructor(config: NgbCarouselConfig, private ngbCarousel : NgbCarousel
  ) {
    // customize default values of carousels used by this component tree
    config.interval = 8000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }
 
 
  ngOnInit() {
  }
 
}