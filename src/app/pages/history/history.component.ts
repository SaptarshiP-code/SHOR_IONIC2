import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ComplaintsService } from "./../../shared/services/complaints/complaints.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {
  safeSrc: SafeResourceUrl;
  downloadUrl =`${environment.API}${environment.SHOR}/resource`;
  slides = ["history01.jpg","history03.jpg","history03.jpg","history04.jpg","history05.jpg","history06.jpg","history07.jpg","history08.jpg"];
  constructor(private sanitizer: DomSanitizer,private complaintsService:ComplaintsService) {
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl
    ("https://www.youtube.com/embed/EBu8CccKaVI");
   }

  ngOnInit() {
  }
  downloadFile(name){
    this.complaintsService.getImage(this.downloadUrl+"/"+name).subscribe(
      (data: any) => {
        let dataType = data.type;
        let binaryData = [];
        binaryData.push(data);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        
        downloadLink.setAttribute('download',name+".pdf");

        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error => {
        if (error !== null) {
          console.log(error, "ERROR");
        }
      }
    );
  }
}
