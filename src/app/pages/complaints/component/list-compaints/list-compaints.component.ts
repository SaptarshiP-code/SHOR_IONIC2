import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router,ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { ComplaintsService } from "./../../../../shared/services/complaints/complaints.service";


@Component({
  selector: 'app-list-compaints',
  templateUrl: './list-compaints.component.html',
  styleUrls: ['./list-compaints.component.scss']
})
export class ListCompaintsComponent implements OnInit {

  complainsData:any;
  name:string;
  mobileNumber: String;
  emailId: String;
  userCategory:String;
  status:String = "";
  inProcessData:any;
  disposedData:any;
  disposedComplaints=false;
  dataSuccess = false;
  myDate:String ;
  myDate1:String ;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private complaintsService: ComplaintsService,
    private datePipe: DatePipe
  ) { 
    this.myDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    this.myDate1 = this.datePipe.transform(new Date(), 'MM/dd/yyyy');

  }

  ngOnInit() {
   // const browserLang = this.translate.getBrowserLang();
    // if(sessionStorage.getItem("lang")){
    //   sessionStorage.setItem('lang',browserLang);
    // }
    const lang = sessionStorage.getItem("lang");
    //console.log(lang, "From List Complaint");
    this.translate.use(lang);

    const userToken = JSON.parse(sessionStorage.getItem("userToken"));
    if (!sessionStorage.getItem("userToken")) {
      this.router.navigate([`/login/other`]);
    }else if ((userToken["user"]["category"] && userToken["user"]["category"] !="dpo")) {
      this.name = userToken.name;
      this.emailId = userToken.emailId;
      this.mobileNumber = userToken.mobileNumber;
      this.userCategory = userToken["user"]["category"];
      //this.route.params.subscribe( params => console.log(params,"ddddddddddddddddddddddddddddddddd") );
      this.getComplains(userToken["user"]["category"]);
      this.route.paramMap.subscribe(params => {
         if(params.get("status") == "disposed"){
          this.disposedComplaints = true
         }
      });
      
    } else {
      this.router.navigate([`/`]);
      
    }
  }
  
  loadComplaintDetail(complaintDetail){
    localStorage.setItem('selectedComplain',JSON.stringify(complaintDetail));
    this.router.navigate([`/complaints/detail`]);
  }

  getDays(date){
    const dateDiff = new Date().valueOf() -new Date(date).valueOf();
    if(Math.floor(dateDiff / (1000 * 3600 * 24))<= 90){
      return (90 - Math.floor(dateDiff / (1000 * 3600 * 24)));
    }else{
      return 'Overdue' ;
    }
  }
  getComplains(userCategory){
    this.complaintsService.listComplaints(this.mobileNumber,userCategory).subscribe(
      (data: any) => {
        this.complainsData = data;
        if(this.userCategory == 'do'){
          this.disposedData = this.getDoCompletedComplaints(data,true);
          this.inProcessData = this.getDoCompletedComplaints(data,false);
        }else if(this.userCategory == 'employer'){
          this.disposedData = this.getEmpCompletedComplaints(data,true);
          this.inProcessData = this.getEmpCompletedComplaints(data,false);
        }else{
          this.disposedData = this.getDisposedComplaints(data,"disposed");
          this.inProcessData = this.getDisposedComplaints(data,"In-Progress");
        }

        this.dataSuccess = true;
      },
      error => {
        if (error !== null) {
          console.log(JSON.stringify(error), "ERROR");
        }
      }
    ); 
  }
  getEmpCompletedComplaints(value,status:Boolean){
    const args = status;
   // console.log(value,"sddfdf"+status);
   
    if(status == true){
      return value.filter((val) => {
        let rVal =  (val.employerSubmitted);
        //console.log(rVal,"val")
        return rVal;
      });
     }else{
      return value.filter((val) => {
        let rVal =  (!val.employerSubmitted);
        //console.log(rVal,"val")
        return rVal;
     });
      
    }
  }
  getDoCompletedComplaints(value,status:Boolean){
    const args = status;
   // console.log(value,"sddfdf"+status);
   if(status == true){
    return value.filter((val) => {
      let rVal =  (val.doSubmitted);
      //console.log(rVal,"val")
      return rVal;
    });
   }else{
    return value.filter((val) => {
      let rVal =  (!val.doSubmitted);
      //console.log(rVal,"val")
      return rVal;
   });
    
  }
}
  getDisposedComplaints(value,status){
    const args = status;
   // console.log(value,"sddfdf"+status);
    return value.filter((val) => {
      let rVal =  (val.status.includes(args));
      //console.log(rVal,"val")
      return rVal;
    })
  }
  getComplaint(disposed:boolean){
    this.disposedComplaints = disposed;
  }

}
