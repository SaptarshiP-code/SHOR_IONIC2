import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss']
})
export class PrivacypolicyComponent implements OnInit {

  constructor(public translate: TranslateService) {
    
   }

  ngOnInit() {
  }

}
