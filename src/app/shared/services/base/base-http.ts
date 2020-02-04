import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpOptions } from '../../models/http-options';
import { environment as env } from '../../../../environments/environment';
import * as Utils from '../../../utils/index';


@Injectable({
  providedIn: 'root'
})
export class BaseHttp {

  constructor(private http: HttpClient) {}

  public Get<T>(
    endPoint: string,
    options?: HttpOptions,
    typeOfOperation?: ApiOperationType
  ): Observable<T> {
    switch (typeOfOperation) {
      case ApiOperationType.COMPLAINT:
        return this.http.get<T>(
          `${env.API}${env.COMPLAINT}/${endPoint}`,
          options
        );
      default:
    }
  }


  public Post<T>(
    endPoint: string,
    // tslint:disable-next-line:ban-types
    params: Object,
    options?: HttpOptions,
    typeOfOperation?: ApiOperationType
  ): Observable<T> {
    switch (typeOfOperation) {
      case ApiOperationType.COMPLAINT:
        return this.http.post<T>(
          `${env.API}${env.SHOR}/${endPoint}`,
          params,
          options
        );
      default:
        if (
          !Utils.isNullOrUndefined(env) &&
          env.API.toLowerCase() === '/dev'
        ) {
          return this.http.post<T>(
            `${env.API}${env.SHOR}/${endPoint}`,
            params,
          );
        }
        return this.http.post<T>(
          `${env.API}${env.SHOR}/${endPoint}`,
          params,
          options
        );
    }
  }


}

export enum ApiOperationType {
  USER,
  COMPLAINT,
  COMPLAINANT,
  LOGIN,
  STATUS,
}
