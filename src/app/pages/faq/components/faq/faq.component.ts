import { Component, OnInit } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
//import {AccordionModule, AccordionGroup} from "ngx-accordion";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faCoffee = faAngleDown;

  constructor(
    public translate: TranslateService
  ) { 
    if (!sessionStorage.getItem("lang")) {
      sessionStorage.setItem("lang", "en");
    }
    const lang = sessionStorage.getItem("lang");

    this.translate.use(lang);
  }

  ngOnInit() {
  }

}
