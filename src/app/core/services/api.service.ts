import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG);

  get<T>(url: string, params?: any) {
    let httpParams = new HttpParams();

    if (params) {
      for (const key in params) {
        if (
          params.hasOwnProperty(key) &&
          params[key] !== undefined &&
          params[key] !== null
        ) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }
    return this.http.get<T>(`${this.config.baseUrl}/${url}`, {
      params: httpParams,
    });
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(`${this.config.baseUrl}/${url}`, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(`${this.config.baseUrl}/${url}`, body);
  }

  delete<T>(url: string, options?: { params?: HttpParams }) {
    return this.http.delete<T>(`${this.config.baseUrl}/${url}`, options);
  }
}
