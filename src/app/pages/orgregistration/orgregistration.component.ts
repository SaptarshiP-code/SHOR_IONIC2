import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { OrganizationService } from './../../shared/services/organization/organization.service';
import { MustMatch } from "./../../shared/helpers/must-match.validator";
import { Lessthen10 } from "./../../shared/helpers/conditional.validator";
import { SpecialCharacter } from "./../../shared/helpers/special_character.validator";
import { first } from "rxjs/operators";
import { AlertService } from "./../../shared/services/alert/alert.service";
import {NgbModal, ModalDismissReasons , NgbModalRef} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: "app-orgregistration",
  templateUrl: "./orgregistration.component.html",
  styleUrls: ["./orgregistration.component.scss"]
})
export class OrgregistrationComponent implements OnInit {
  addOrgRegForm: FormGroup;
  submitted = false;
  nemp: Number;
  showHelpText: boolean = false;
  modalReference: NgbModalRef;
  isLoading: Boolean = true;
  HideSubCategory: Boolean = true;

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private alertService: AlertService
  ) {
    const lang = sessionStorage.getItem("lang");
    translate.use(lang);
  }

  ngOnInit() {
    this.addOrgRegForm = this.formBuilder.group(
      {
        totalEmp: ["", [Validators.required]],
        registrationNumber: ["", [Validators.required]],
        orgAddress: ["", Validators.required],
        employerName: ["", Validators.required],
        orgType: ["", Validators.required],
        orgSubCategory: [""],
        orgName: ["", Validators.required],
        mobileno: [
          "",
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
        confirmmobileno: ["", Validators.required],
        emailno: ["", [Validators.required, Validators.email]],
        confirmemail: ["", [Validators.required, Validators.email]]
      },
      {
        validator: [
          Lessthen10("totalEmp"),
          MustMatch("mobileno", "confirmmobileno"),
          MustMatch("emailno", "confirmemail"),
          SpecialCharacter("registrationNumber")
        ]
      }
    );
    this.getworkPlaceCategory();
    // this.formControlValueChanged();
  }
  // formControlValueChanged() {
  //   const sub = this.addOrgRegForm.get("orgSubCategory");
  //   this.addOrgRegForm.get("orgType").valueChanges.subscribe((mode: string) => {
  //     console.log(mode);
  //     if (mode) {
  //       console.log("set");
  //       sub.setValidators([Validators.required]);
  //     } else if (mode == "") {
  //       console.log("remove");
  //       sub.clearValidators();
  //       sub.clearAsyncValidators();
  //     }else if (this.workPlaceCategory.length < 0){
  //       console.log("remove by length");
  //       sub.clearValidators();
  //       sub.clearAsyncValidators();
  //     }
  //     sub.updateValueAndValidity();
  //   });
  // }
  closeResult;

  open(content) {
    this.submitted = true;
    console.log(this.addOrgRegForm);
    // stop here if form is invalid
    if (this.addOrgRegForm.invalid) {
      return;
    }
    console.log(this.addOrgRegForm);
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  getHelpToggle() {
    this.showHelpText = !this.showHelpText;
  }
  onCloseToggle() {
    this.showHelpText = false;
  }
  get f() {
    return this.addOrgRegForm.controls;
  }
  saveOrgDetails() {
    this.submitted = true;
    var details = {
      registrationNumber: this.addOrgRegForm.value["registrationNumber"],
      orgName: this.addOrgRegForm.value["orgName"],
      orgAddress: this.addOrgRegForm.value["orgAddress"],
      totalEmp: this.addOrgRegForm.value["totalEmp"],
      employerName: this.addOrgRegForm.value["employerName"],
      mobileNumber: this.addOrgRegForm.value["mobileno"],
      emailId: this.addOrgRegForm.value["emailno"],
      orgType: this.addOrgRegForm.value["orgType"]
    };
    console.log("details>>>>", details);
    this.organizationService
      .getOrganizationRegistration(details)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data, "data transfer succesful");
          if (data && data.orgName) {
            this.alertService.success(
              "Details saved! please proceed with Employer Registration.",
              true
            );
            setTimeout(() => {
              this.modalService.dismissAll();
              this.router.navigate([`/register/employer`]);
            }, 2000);
          } else {
            console.log("else data");
            console.log(data);
              this.modalService.dismissAll();
          }
        },
        error => {
          if(error){
            this.addOrgRegForm.get('registrationNumber').setErrors({ unique: true });
            console.log(this.addOrgRegForm);
          }
          this.modalService.dismissAll();
          // this.alertService.error(error);
          if (error !== null) {
            //console.log(error, "Error");
          }
        }
      );
  }

  workPlaceCategory: any = [];
  x;
  getworkPlaceCategory() {
    this.workPlaceCategory = [];
    // this.workPlaceCategory.push({ id: "government", name: "Government Organisation" },{ id: "private", name: "Private Organisation" });
    this.organizationService.getOrganizationCategories().subscribe(
      cat => {
        if (cat.length > 0) {
          console.log(cat);
          for (this.x in cat) {
            this.workPlaceCategory.push({ id: cat[this.x], name: cat[this.x] });
          }
        } else if (cat.length <= 0) {
          return;
        } else {
          return;
        }
      },
      error => {
        if (error !== null) {
          this.isLoading = false;
          console.log(error.error, "Errors");
          this.alertService.error(error);
        }
      }
    );
  }

  SubCategoryOrganization: any = [];
  subcatIndex;

  changeCategory(cat) {
    const sub = this.addOrgRegForm.get("orgSubCategory");

    if(!cat || cat == "" || cat == null || cat == undefined ){
      return;
    }
    this.SubCategoryOrganization = [];
    console.log(cat);
    this.organizationService.getOrganizationSubCategories(cat).subscribe(
      subCat => {
        console.log(subCat);
        if (subCat.length > 0) {
          console.log("add validator");
          sub.setValidators([Validators.required]);
          this.HideSubCategory = false;
          for (this.subcatIndex in subCat) {
            this.SubCategoryOrganization.push({
              id: subCat[this.subcatIndex],
              name: subCat[this.subcatIndex]
            });
          }
        } else if (subCat.length <= 0) {
          sub.clearValidators();
          sub.clearAsyncValidators();
          console.log("Else part clear validators");
          this.HideSubCategory = true;
        } else {
          sub.clearValidators();
          sub.clearAsyncValidators();
        }
        sub.updateValueAndValidity();
      },
      error => {
        if (error !== null) {
          sub.clearValidators();
          sub.clearAsyncValidators();
          sub.updateValueAndValidity();
          this.HideSubCategory = true;
          this.isLoading = false;
          console.log(error.error, "Errors");
          this.alertService.error(error);
        }
      }
    );
  }
}





