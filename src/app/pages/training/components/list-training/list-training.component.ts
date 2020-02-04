import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TrainingService } from "./../../../../shared/services/training/training.service";
import { AuthService  } from "./../../../../shared/services/auth/auth.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-list-training",
  templateUrl: "./list-training.component.html",
  styleUrls: ["./list-training.component.scss"]
})
export class ListTrainingComponent implements OnInit {
  tabName: String;
  userId: String;
  trainingData: any;
  loadTraining = false;
  userCategory: String;
  sortBy = "date";
  sortOrder = "asc";
  deleteTrainingId: String;
  trainingDelete: boolean = false;
  currentUser:any;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private trainingService: TrainingService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {
    //Setting up Translation
    const lang = sessionStorage.getItem("lang");
    translate.use(lang);
    

    const allowedUserRoles = ['do','employer'];
    const accessData = this.authService.validateAccess(allowedUserRoles);
   
    if(accessData && accessData['userCategory'] ){
      this.userId = accessData['userId'];
      this.userCategory = accessData['userCategory'];
      this.getSavedTrainings(accessData['userId']);
    }else{
    //  console.log(accessData);
      this.authService.unauthorizedRedirect();
    }

    // const userToken = JSON.parse(sessionStorage.getItem("userToken"));
    // if (!sessionStorage.getItem("userToken")) {
    //   this.router.navigate([`/login/other`]);
    // } else if (userToken["user"]["category"] != "") {
    //   this.userId = userToken._id;
    //   this.userCategory = userToken["user"]["category"];
    //   this.getSavedTrainings(this.userId);
    // } else {
    //   this.router.navigate([`/login/other`]);
    // }

  }

  ngOnInit() {
    this.tabName = "Draft";
  }
  closeResult;
  open(content, id) {
    this.trainingDelete = false;
    this.deleteTrainingId = id;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  deleteTraining(id) {
    this.trainingDelete = false;
   // console.log(id, ":: Training Id to delete");
    this.trainingService.deleteTraining(id).subscribe(
      // this.trainingService.getAlltraining().subscribe(
      (data: any) => {
        this.trainingDelete = true;
        this.openTab(this.tabName);
      },
      error => {
        if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  openTab(name: String) {
    this.loadTraining = false;
    this.tabName = name;
    switch (name) {
      case "Draft": {
        this.getSavedTrainings(this.userId);
        break;
      }
      case "Conducted": {
        this.getConductedTrainings(this.userId);
        break;
      }
      case "Published": {
        this.getPublishedTrainings(this.userId);
        break;
      }
      case "allPublished": {
        this.getPublishedTrainings(this.userId);
        break;
      }
    }
  }

  getSavedTrainings(userId: String) {
    this.trainingService.getSavedTrainingByUser(userId).subscribe(
      // this.trainingService.getAlltraining().subscribe(
      (data: any) => {
       // console.log(data, "Training Data");
        this.trainingData = data.data;
        this.loadTraining = true;
      },
      error => {
        if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }
  getPublishedTrainings(userId: String) {
    this.trainingService.getPublishedTrainingByUser(userId).subscribe(
      // this.trainingService.getAlltraining().subscribe(
      (data: any) => {
        //console.log(data, "Training Data");
        this.trainingData = data.data;
        this.loadTraining = true;
      },
      error => {
        if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }
  getConductedTrainings(userId: String) {
    this.trainingService.getConductedTrainingByUser(userId).subscribe(
      // this.trainingService.getAlltraining().subscribe(
      (data: any) => {
        //console.log(data, "Training Data");
        this.trainingData = data.data;
        this.loadTraining = true;
      },
      error => {
        if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }
  getAllTraining() {
    this.trainingService.getAllPublishedtraining().subscribe(
      // this.trainingService.getAlltraining().subscribe(
      (data: any) => {
      //  console.log(data, "Training Data");
        this.trainingData = data.data;
        this.loadTraining = true;
      },
      error => {
        if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }

  getHours(startTime: any, endTime: any) {
    const startMinutes = startTime.split(":");
    const val = Math.floor(startMinutes[0] * 60) + Math.floor(startMinutes[1]);
    const endMinutes = endTime.split(":");
    const val2 = Math.floor(endMinutes[0] * 60) + Math.floor(endMinutes[1]);
    const result = Math.floor(val2 - val);
    return { hrs: Math.floor(result / 60), min: result % 60 };
  }
}
