import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './shared/services/auth/auth.service';
import { User } from './shared/models/user';
import {LoadingScreenService} from './shared/services/loading-screen/loading-screen.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SHORAPP';
  currentUser: User;

  constructor(private router: Router,
    private loadingScreenService: LoadingScreenService,
    public translate: TranslateService,
    private authService: AuthService) {

    this.authService.currentUser.subscribe(x => this.currentUser = x);

    // const browserLang = translate.getBrowserLang();
    //   //translate.use(browserLang.match(/en|hn/) ? browserLang : 'en');
    //   let lang;
    //   if(sessionStorage.getItem("lang")){
    //     lang = sessionStorage.getItem("lang");
    //   }else{
    //     lang = browserLang.match(/en|hn/) ? browserLang : 'en';
    //     sessionStorage.setItem("lang",lang);
    //   }
    //   console.log(sessionStorage.getItem("lang"),'sessionStorage.getItem("lang") in app component');
    //   translate.use(sessionStorage.getItem("lang"));
  }
  login() {
    this.router.navigate([`login`]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login/select']);
}

}
