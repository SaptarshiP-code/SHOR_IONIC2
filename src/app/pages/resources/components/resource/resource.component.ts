import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ComplaintsService } from "./../../../../shared/services/complaints/complaints.service";

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

  constructor( private complaintsService: ComplaintsService) { }
  tabName:String = 'Acts';
  downloadUrl =`${environment.API}${environment.SHOR}/resource`;

  ngOnInit() {

  }
  openTab(name:String){
    this.tabName = name;
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
