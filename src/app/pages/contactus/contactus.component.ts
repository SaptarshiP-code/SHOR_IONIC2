import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ComplaintsService } from "./../../shared/services/complaints/complaints.service"

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  private downloadUrl = `${environment.API}${environment.SHOR}/resource`;
  constructor( private complaintsService: ComplaintsService) { }

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
