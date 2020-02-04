import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ReportsService } from "../../shared/services/reports/reports.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingScreenService } from "../../shared/services/loading-screen/loading-screen.service";

import * as jsPDF from "jspdf";
import "jspdf-autotable";
//import 'jspdf-autotable';
//declare let jsPDF;

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"]
})
export class ReportComponent implements OnInit {
  reportData: any;
  showAnnualReport = false;
  year: Number;
  userData: any;
  userCategory: String;
  tabName: String = "AnnualReport";
  ComplaintDetailsReportForm: FormGroup;
  ComplaintReportData: any;
  showComplaintReport = false;
  ComplaintDataCount: Number;
  employerDataCount: Number=0;

  OrganisationStatusReportForm: FormGroup;
  OrganisationReportData: any;
  showOrgnaisationReport = false;
  previousUrl: String;
  constructor(
    private router: Router,
    private reportsService: ReportsService,
    private formBuilder: FormBuilder,
    private loadingScreenService: LoadingScreenService
  ) {
      
}

  ngOnInit() {
    const userToken = JSON.parse(sessionStorage.getItem("userToken"));
    if (
      !userToken ||
      userToken["user"]["category"] == "" ||
      userToken["user"]["category"] == "complainants"
    ) {
      this.router.navigate([`/`]);
    } else {
      this.userData = userToken;
      this.userCategory = userToken["user"]["category"];
      this.year = 2019;
      this.getAnnualReportData(this.year);
    }
    this.ComplaintDetailsReportForm = this.formBuilder.group({
      year: [2019, [Validators.required]],
      status: ["all", [Validators.required]],
      recieved: ["all", [Validators.required]]
    });
    this.OrganisationStatusReportForm = this.formBuilder.group({
      regStatus: ["all", [Validators.required]],
      iccStatus: ["all", [Validators.required]]
    });
  }

  openTab(name: String) {
    this.tabName = name;
    if (name == "ComplaintDetailsReport") {
      this.getComplaintDetailsReport();
    }
    if (name == "OrganisationStatusReport") {
      this.getOrganisationStatusReport();
    }
  }
  selectYear(year: number) {
    this.year = year;
    this.getAnnualReportData(year);
  }
   complaintDownloadPdf() {
    this.loadingScreenService.loading = true;
    this.loadingScreenService.startLoading();
    
    return new Promise(resolve => {
      var doc = new jsPDF();

      doc.setFontSize(24);
      var pageSize = doc.internal.pageSize;
      var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      var text1;
      let title = "COMPLAIN DETAIL REPORT";

      text1 = doc.splitTextToSize(title, pageWidth - 90, {});
      doc.setFontSize(24);
      doc.text(text1, 45, 20);
      doc.setFontSize(12);
      //let topHead = [[{content: 'ANNUAL REPORT ON CASES OF SEXUAL HARASSMENT FY - 2019',colSpan: 2, styles: {halign: 'center',cellWidth: 'wrap', rowPageBreak: 'auto', fillColor: [240,240,240,1]}}]];
      let topBody = [];

      topBody.push([
        "Complaints found as per your selection",
        this.ComplaintDataCount
      ]);

      doc.autoTable({
        //head: topHead,
        body: topBody,
        startY: 40,
        bodyStyles: { valign: "top" },
        styles: { cellWidth: "wrap", rowPageBreak: "auto" },
        columnStyles: { text: { cellWidth: "auto" } }
      });
      let body = [];
      let count = 0;

      this.ComplaintReportData.forEach(complaintData => {
        count = count + 1;
        let workPlaceCategory = "";
        let orgName = "";
        let orgAddress = "";
        if (complaintData.workPlace && complaintData.workPlace.organisation) {
          if (complaintData.workPlace.organisation.category) {
            workPlaceCategory = complaintData.workPlace.organisation.category;
          }

          if (complaintData.workPlace.organisation.name) {
            orgName = complaintData.workPlace.organisation.name;
          }
          if (complaintData.workPlace.organisation.address) {
            orgAddress = complaintData.workPlace.organisation.address;
          }
        }
        const dateVal = complaintData.createdAt.split("T");
        body.push([
          complaintData.id,
          complaintData.status,
          complaintData.complaintViewer,
          dateVal[0],
          workPlaceCategory,
          orgName,
          orgAddress
        ]);
      });
      let head = [
        [
          {
            content: "id",
            styles: { halign: "center", fillColor: [240, 240, 240, 1] }
          },
          {
            content: "Status",
            styles: { halign: "center", fillColor: [240, 240, 240, 1] }
          },
          {
            content: "Pending with",
            styles: { halign: "center", fillColor: [240, 240, 240, 1] }
          },
          {
            content: "Date",
            styles: { halign: "center", fillColor: [240, 240, 240, 1] }
          },
          {
            content: "Category",
            styles: { halign: "center", fillColor: [240, 240, 240, 1] }
          },

          {
            content: "Name",
            styles: { halign: "center", fillColor: [240, 240, 240, 1] }
          },
          {
            content: "Address",
            styles: { halign: "center", fillColor: [240, 240, 240, 1] }
          }
        ]
      ];

      doc.autoTable({
        head: head,
        body: body,
        startY: doc.previousAutoTable.finalY + 15,
        rowPageBreak: "auto",
        bodyStyles: { valign: "top" },
        styles: { cellWidth: "auto" },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 25 },
          2: { cellWidth: 15 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 },
          6: { cellWidth: 55 }
        }
      });
      //    console.log(doc,"doc2");

      doc.save("complainDetailReport.pdf");
      setTimeout(() => {
        resolve("resolved");
        
        this.loadingScreenService.stopLoading();
      }, 1000);
    });
    //this.loadingScreenService.stopLoading();
    //console.log(doc,"doc2");
    //  doc.save("complainDetailReport.pdf");
  }
  downloadPdf() {
    var doc = new jsPDF();

    doc.setFontSize(24);
    var pageSize = doc.internal.pageSize;
    var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    var text1;
    let title;
    if (this.userCategory == "do") {
      title = "District Administration, Gautam Buddh Nagar";
    } else if (this.userCategory == "employer" || this.userCategory == "icc") {
      title = this.userData["organisation"]["name"]; //"District Administration, Gautam Buddh Nagar";
    } else if (this.userCategory == "lcc") {
      title = "Local Complaints Committee";
    }
    text1 = doc.splitTextToSize(title, pageWidth - 90, {});
    doc.setFontSize(24);
    doc.text(text1, 45, 20);
    doc.setFontSize(18);
    var pageSize = doc.internal.pageSize;
    var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    var text = doc.splitTextToSize(
      "ANNUAL REPORT ON CASES OF SEXUAL HARASSMENT FY - " + this.year,
      pageWidth - 50,
      {}
    );
    doc.text(text, 25, 40);
    //doc.text(,20,20);
    doc.setFontSize(12);
    //let topHead = [[{content: 'ANNUAL REPORT ON CASES OF SEXUAL HARASSMENT FY - 2019',colSpan: 2, styles: {halign: 'center',cellWidth: 'wrap', rowPageBreak: 'auto', fillColor: [240,240,240,1]}}]];
    let topBody = [];
    topBody.push(["1. COMPLAINTS RECEIVED", this.reportData.totalComplaints]);
    topBody.push([
      "2. COMPLAINTS DISPOSED OF",
      this.reportData.totalDisposedComplaints
    ]);
    topBody.push([
      "3. CASES PENDING FOR MORE THAN 90 DAYS",
      this.reportData.pendingComplaints
    ]);
    topBody.push([
      "4. AWARENESS PROGRAMMES CARRIED OUT",
      this.reportData.awarenessPrograms
    ]);
    doc.autoTable({
      //head: topHead,
      body: topBody,
      startY: 60,
      bodyStyles: { valign: "top" },
      styles: { cellWidth: "wrap", rowPageBreak: "auto" },
      columnStyles: { text: { cellWidth: "auto" } }
    });
    let body = [];
    let count = 0;
    for (var comment in this.reportData.comments) {
      count = count + 1;
      body.push([count + ". " + this.reportData.comments[comment]]);
    }

    let head = [
      [
        {
          content: "NATURE OF ACTION TAKEN",
          styles: { halign: "center", fillColor: [240, 240, 240, 1] }
        }
      ]
    ];
    //[["NATURE OF ACTION TAKEN BY THE DO"]];
    //console.log(this.reportData.comments);
    doc.autoTable({
      head: head,
      body: body,
      startY: doc.previousAutoTable.finalY + 15,
      bodyStyles: { valign: "top" },
      styles: { cellWidth: "wrap", rowPageBreak: "auto" },
      columnStyles: { text: { cellWidth: "auto" } }
    });

    doc.save("annualReport.pdf");
  }

  organizationDownloadPdf() {
    this.loadingScreenService.startLoading();
    //return new Promise(resolve => {
    var doc = new jsPDF();
    
 
    
    doc.setFontSize(24);
    var pageSize = doc.internal.pageSize;
    var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    var text1;
    let title = "Organisation Status Report";

    text1 = doc.splitTextToSize(title, pageWidth - 90, {});
    doc.setFontSize(24);
    doc.text(text1, 45, 20);
    doc.setFontSize(12);

    let topBody = [];

    topBody.push([
      "Organisation Registred:",
      this.OrganisationReportData.orgRegistered
    ]);
    topBody.push(["ICC Constituted:", this.OrganisationReportData.iccFormed]);

    doc.autoTable({
      //head: topHead,
      body: topBody,
      startY: 40,
      bodyStyles: { valign: "top" },
      styles: { cellWidth: "wrap", rowPageBreak: "auto" },
      columnStyles: { text: { cellWidth: "auto" } }
    });
    let body = [];
    let count = 0;

    this.OrganisationReportData.list.forEach(organisationData => {
      count = count + 1;
      let orgStatus = "Not Registered";
      let iccStatus = "No";
      let orgAddress = "";
      if (organisationData.status == true) {
        orgStatus = "Registered";
      }
      if (organisationData.iccStatus == true) {
        iccStatus = "YES";
      }

      body.push([count, organisationData.orgName, orgStatus, iccStatus]);
    });
    let head = [
      [
        {
          content: "#",
          styles: { halign: "left", fillColor: [240, 240, 240, 1] }
        },
        {
          content: "Organisation Name",
          styles: { halign: "left", fillColor: [240, 240, 240, 1] }
        },
        {
          content: "Registration Status",
          styles: { halign: "left", fillColor: [240, 240, 240, 1] }
        },
        {
          content: "ICC Constituted",
          styles: { halign: "left", fillColor: [240, 240, 240, 1] }
        }
      ]
    ];
    //[["NATURE OF ACTION TAKEN BY THE DO"]];
    //console.log(this.reportData.comments);
    
    doc.autoTable({
      head: head,
      body: body,
      startY: doc.previousAutoTable.finalY + 15,
      rowPageBreak: "auto",
      bodyStyles: { valign: "top" },
      styles: { cellWidth: "auto" },
      //columnStyles: { text: { cellWidth: "wrap" } }
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 100 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 }
        // etc
      }
    });
    
    doc.save("organisationStausReport.pdf");
    
    setTimeout(() => {
     // resolve("resolved");
     
      this.loadingScreenService.stopLoading();
    }, 3000);
  //});
  }
  getOrganisationStatusReport() {
    const registrationStatus = this.OrganisationStatusReportForm.value[
      "regStatus"
    ];
    const iccStatus = this.OrganisationStatusReportForm.value["iccStatus"];
    if (registrationStatus != "" && iccStatus != "") {
      this.reportsService
        .organisationsReport(registrationStatus, iccStatus)
        .subscribe(
          (data: any) => {
            this.OrganisationReportData = data;
            this.showOrgnaisationReport = true;
            var keys = Object.keys(data.list);
            // var len = keys.length;
            this.employerDataCount = keys.length;
            // this.downloadPdf();
            
          },
          error => {
            if (error !== null) {
              console.log(JSON.stringify(error), "ERROR");
            }
          }
        );
    }
  }

  getComplaintDetailsReport() {
    //complaintDetailsReport
    const year = this.ComplaintDetailsReportForm.value["year"];
    const status = this.ComplaintDetailsReportForm.value["status"];
    const recieved = this.ComplaintDetailsReportForm.value["recieved"];

    if (year != "" && status != "" && recieved != "") {
      this.reportsService
        .complaintDetailsReport(year, status, recieved)
        .subscribe(
          (data: any) => {
            this.ComplaintReportData = data;
            var keys = Object.keys(data);
            // var len = keys.length;
            this.ComplaintDataCount = keys.length;
            this.showComplaintReport = true;
            // this.downloadPdf();
            
          },
          error => {
            if (error !== null) {
              console.log(JSON.stringify(error), "ERROR");
            }
          }
        );
    }
  }

  getAnnualReportData(year: Number) {
    this.reportsService.annualReport(year).subscribe(
      (data: any) => {
        this.reportData = data;
        this.showAnnualReport = true;
        // this.downloadPdf();
        
      },
      error => {
        if (error !== null) {
          console.log(JSON.stringify(error), "ERROR");
        }
      }
    );
  }
}
