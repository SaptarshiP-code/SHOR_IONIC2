import { Component, OnInit } from '@angular/core';

import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { OrganizationService } from "../../../../shared/services/organization/organization.service";
import { UnitHeadService } from "../../../../shared/services/organization/unit-head.service";

@Component({
  selector: 'app-unit-head',
  templateUrl: './unit-head.component.html',
  styleUrls: ['./unit-head.component.scss']
})
export class UnitHeadComponent implements OnInit {

  unitsData:any;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private organizationService: OrganizationService,
    private unitHeadService: UnitHeadService
  ) {}

  ngOnInit() {
    const userToken = JSON.parse(sessionStorage.getItem('userToken'));

    if (!sessionStorage.getItem("lang")) {
      sessionStorage.setItem("lang", "en");
    }
    const lang = sessionStorage.getItem("lang");

    this.translate.use(lang);

        
    if(userToken['user']['category']!='employer'){
      this.router.navigate([`/home`]);
    }else{
      this.getUnits();
    }
  }

  getUnits() {
    //console.log("getUnits");
   // organisation
   const userToken = JSON.parse(sessionStorage.getItem('userToken'));
   const organisationCode = userToken['organisation']['regNumber'];// "zabcdefsoftware07";// 
   // this.unitHeadService.getUnit();

    this.unitHeadService.getUnit(organisationCode).subscribe(
      (data: any) => {
        //console.log(data,"List of Units");
        
        if(data[0]){
        //  console.log("Unit Present");
          this.unitsData = data[0].unit;
        }else{
        //  console.log("Unit not Present");
          this.router.navigate([`/employer/add-unit`]);
        }
        //console.log(data, "data transfer successful");
      },
      error => {
        if (error !== null) {
         // console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }

  getIccList(unitCode:any){
    localStorage.setItem("selectedUnit",unitCode.code);
    localStorage.setItem("selectedUnitName",unitCode.name);
    localStorage.setItem("selectedUnitIccStatus",unitCode.iccStatus);

    this.router.navigate([`/employer/icc`]);

  }
}
