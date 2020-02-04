import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BaseService {

constructor() { }
  getOptions() {
    const options = {
       headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        }
    };
    return options;
  }
}
