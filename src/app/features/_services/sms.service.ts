import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  constructor(private http: HttpClient) {}

  sendSms(recipient: string, message: string): Observable<any> {
    const url = `${this.BASE_URL}/gateway/devices/${this.DEVICE_ID}/send-sms`;

    const headers = new HttpHeaders({
      'x-api-key': this.API_KEY,
      'Content-Type': 'application/json',
    });

    const body = {
      recipients: [recipient],
      message: message,
    };

    return this.http.post(url, body, { headers });
  }
}
