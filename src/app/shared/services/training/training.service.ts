import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base/base.service';
import { Training } from '../../../pages/training/models/training'

@Injectable({
  providedIn: 'root'
})
export class TrainingService extends BaseService {

  constructor(
    private http: HttpClient) {
    super();
  }

  getAlltraining(){
    const url = `${environment.API}${environment.SHOR}/training`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }
  getAllPublishedtraining(){
    const url = `${environment.API}${environment.SHOR}/published/trainings`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }

  getAllConductedtraining(){
    const url = `${environment.API}${environment.SHOR}/conducted/trainings`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }

  getTrainingByUser(userId: String){
    const url = `${environment.API}${environment.SHOR}/training/user/${userId}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }
  getSavedTrainingByUser(userId: String){
    const url = `${environment.API}${environment.SHOR}/training/save/user/${userId}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }
  getPublishedTrainingByUser(userId: String){
    const url = `${environment.API}${environment.SHOR}/training/publish/user/${userId}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }
  getConductedTrainingByUser(userId: String){
    const url = `${environment.API}${environment.SHOR}/training/conducted/user/${userId}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }

  getTrainingDetails(trainingId : String){
    //const url = `${environment.API}${environment.SHOR}/training`;
    const url = `${environment.API}${environment.SHOR}/training/${trainingId}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );

  }

  addTraining(trainingData:Training){
    const url = `${environment.API}${environment.SHOR}/training`;
    return this.http.post(url, trainingData).pipe(
      map((res: any) => {
       if (res && res.success) {
        //  this.sessionStorage.saveToken();
        // console.log(res,"addIccMembers SuCCESS")
        }
        return res;
      })
    );

  }

  updateTraining(trainingId:String, trainingData:Training){
    const url = `${environment.API}${environment.SHOR}/training/${trainingId}`;
    return this.http.put(url, trainingData).pipe(
      map((res: any) => {
       if (res && res.success) {
        //  this.sessionStorage.saveToken();
        // console.log(res,"addIccMembers SuCCESS")
        }
        return res;
      })
    );

  }

  deleteTraining(trainingId: String){
    const url = `${environment.API}${environment.SHOR}/training/${trainingId}`;
    return this.http.delete(url).pipe(
      map((res: any) => {
        // if (res && res.success) {
        //  // console.log(res,"Committie Details")
        //  }
         return res;
       })
    );
  }

}
