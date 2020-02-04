import { Component, OnInit } from '@angular/core';

import { TranslateService } from "@ngx-translate/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { CommitteeService } from "../../../../shared/services/committee/committee.service";

@Component({
  selector: 'app-lcc',
  templateUrl: './lcc.component.html',
  styleUrls: ['./lcc.component.scss']
})
export class LccComponent implements OnInit {
  
  loadLccData = false;
  tabName:String;
  iccData: any;
  lccData: any;
  lccDataFilter: any;
  deleteUserId: String;
  lccDelete: boolean = false;
  deleteError: String = "";

  constructor(
    private router: Router,
    public translate: TranslateService,
    private committeeService: CommitteeService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getLcc();
  }

  openTab(name: String) {
    this.loadLccData = false;
    this.tabName = name;
    switch (name) {
      case "active": {
       this.lccDataFilter = this.lccData.filter(function(lccData) {
        return (lccData.status == 'active' || (lccData.status == 'inactive' && lccData.user.subCategory !='chairperson'));
      });
      this.loadLccData = true;
        break;
      }
      case "historic": {
        this.lccDataFilter = this.lccData.filter(function(lccData) {
          return (lccData.status != 'active' && lccData.user.subCategory=='chairperson');
        });
        this.loadLccData = true;
        break;
      }
    }
  }


  getLcc(){
    //console.log("getIcc");
    

    this.committeeService.getLcc().subscribe(
      (data: any) => {
        this.lccData = data;
        this.openTab('active');
       // console.log(data, "ICC data transfer successful");
      },
      error => {
        if (error !== null) {
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
        this.getLcc();
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
