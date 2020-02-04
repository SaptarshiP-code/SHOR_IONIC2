import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TrainingService } from "./../../../../shared/services/training/training.service";

@Component({
  selector: "app-training",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.scss"]
})
export class TrainingComponent implements OnInit {
  tabName: String = "InnaugrationNote";
  trainingData: any;
  loadTraining: Boolean;
  slides = ["training03.JPG","training02.JPG","training00.JPG","training01.JPG"];
  conductedTrainingData: any;
  loadConductedTraining: Boolean;
  sortBy = "date";
  sortOrder = "asc";

  constructor(
    private translate: TranslateService,
    private trainingService: TrainingService
  ) {
    const lang = sessionStorage.getItem("lang");

    translate.use(lang);
  }

  ngOnInit() {
    //this.getTrainings();
  }
  openTab(name: String) {
    this.tabName = name;
    if (name == "UpcomingTraining") {
      this.getTrainings();
    }
    if (name == "ConductedTraining") {
      this.getConductedTrainings();
    }
  }

  getTrainings() {
    this.trainingService.getAllPublishedtraining().subscribe(
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

  getConductedTrainings() {
    this.trainingService.getAllConductedtraining().subscribe(
      // this.trainingService.getAlltraining().subscribe(
      (data: any) => {
        //console.log(data, "Training Data");
        this.conductedTrainingData = data.data;
        this.loadConductedTraining = true;
      },
      error => {
        if (error !== null) {
          // console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }
}
