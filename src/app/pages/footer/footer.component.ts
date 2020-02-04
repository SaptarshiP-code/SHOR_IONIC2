import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public translate: TranslateService) {

    //const browserLang = translate.getBrowserLang();

    //translate.use(browserLang.match(/en|hn/) ? browserLang : 'en');

    if (sessionStorage.getItem("lang")) {
      translate.use(sessionStorage.getItem("lang"));

    } 

   }

  ngOnInit() {
  }

}
