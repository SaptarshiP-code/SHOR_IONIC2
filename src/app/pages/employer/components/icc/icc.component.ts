import { Component, OnInit } from '@angular/core';

import { TranslateService } from "@ngx-translate/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { OrganizationService } from "../../../../shared/services/organization/organization.service";
import { CommitteeService } from "../../../../shared/services/committee/committee.service";
import { UnitHeadService } from "../../../../shared/services/organization/unit-head.service";
import { AlertService } from "./../../../../shared/services/alert/alert.service";


@Component({
  selector: 'app-icc',
  templateUrl: './icc.component.html',
  styleUrls: ['./icc.component.scss']
})
export class IccComponent implements OnInit {

  loadIccData = false;
  tabName:String;
  iccData: any;
  iccDataFilter: any;
  unitCode: String;
  selectedUnit = [];
  deleteUserId: String;
  lccDelete: boolean = false;
  deleteError: String = "";

  constructor(
    private router: Router,
  public translate: TranslateService,
  private organizationService: OrganizationService,
  private committeeService: CommitteeService,
  private modalService: NgbModal,
  private alertService: AlertService
  ) { 

  }

  ngOnInit() {
    if(localStorage.getItem('selectedUnit') && localStorage.getItem('selectedUnitName')){
      this.selectedUnit['code'] = localStorage.getItem('selectedUnit');
      this.selectedUnit['name'] = localStorage.getItem('selectedUnitName');
      this.selectedUnit['iccStatus'] = localStorage.getItem('selectedUnitIccStatus');
    }else{
      this.alertService.error("Please click on ICC details for ICC List",true);
      this.router.navigate([`/employer`]);
    }
    
        
    // if(userToken['user']['category']!='employer'){
    //  // this.router.navigate([`/home`]);
    //  console.log(userToken['user']['category']+"userToken['user']['category']");
    // }else{
    //   this.getIcc();
    // }
    this.getIcc();
  }

  openTab(name: String) {
    this.loadIccData = false;
    this.tabName = name;
    switch (name) {
      case "active": {
       this.iccDataFilter = this.iccData.filter(function(iccData) {
        return (iccData.status == 'active'|| (iccData.status == 'inactive' && iccData.user.subCategory !='chairperson'));
      });
      this.loadIccData = true;
        break;
      }
      case "historic": {
        this.iccDataFilter = this.iccData.filter(function(iccData) {
          return (iccData.status != 'active' && iccData.user.subCategory=='chairperson' );
        });
        this.loadIccData = true;
        break;
      }
    }
  }

    getIcc(){
     // console.log("getIcc");
      const userToken = JSON.parse(sessionStorage.getItem('userToken'));
      const organisationCode =  userToken['organisation']['regNumber'];//'zabcdefsoftware07';//
      this.unitCode = localStorage.getItem('selectedUnit');

      this.committeeService.getCommitteByUnit(organisationCode, this.unitCode).subscribe(
        (data: any) => {
          this.iccData = data;
          this.openTab('active');
         // console.log(data, "ICC data transfer successful");
        },
        error => {
          if (error !== null) {
            this.deleteError = error;
           // console.log(JSON.stringify(error), "ERROR");
          }
        }
      );

    }

    closeResult;
    open(content, id) {
      this.lccDelete = false;
      this.deleteError = "";
      this.deleteUserId = id;
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
    deleteLcc(id) {
      this.lccDelete = false;
      this.deleteError = "";
      
      this.committeeService.deleteUser(id).subscribe(
        // this.trainingService.getAlltraining().subscribe(
        (data: any) => {
          this.lccDelete = true;
          this.getIcc();
        },
        error => {
          if (error !== null) {
            this.deleteError = error;
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
    

}
