import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { RequestReadModel } from '@shared/_models';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrRequestService {
  private hubConnection!: signalR.HubConnection;
  private isConnected = false;

  private newRequestsSubject = new BehaviorSubject<RequestReadModel[]>([]);
  readonly newRequests$ = this.newRequestsSubject.asObservable();

  async startConnection(): Promise<void> {
    if (this.isConnected) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/hubs/request`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      this.isConnected = true;
    } catch (err) {
      console.error('SignalR connection failed:', err);
    }
  }

  async joinStatusGroup(statusId: string): Promise<void> {
    if (!this.isConnected) {
      console.warn('SignalR not yet connected. Retrying...');
      await this.startConnection();
    }

    try {
      await this.hubConnection.invoke('JoinStatusGroup', statusId);
    } catch (err) {
      console.error(`Failed to join group for status ${statusId}:`, err);
    }
  }

  onNewRequest(callback: (request: RequestReadModel) => void): void {
    this.hubConnection.off('NewRequestReceived');
    this.hubConnection.on('NewRequestReceived', (request: RequestReadModel) => {
      const current = this.newRequestsSubject.value;
      const alreadyExists = current.some(
        (r) => r.requestId === request.requestId
      );

      if (!alreadyExists) {
        this.newRequestsSubject.next([...current, request]);
      }

      callback(request);
    });
  }

  clearNewRequests(): void {
    this.newRequestsSubject.next([]);
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
