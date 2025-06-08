import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RequestReadModel } from '../../../../_models/request-read.model';
import { StudentRequestService } from '../../../../_services/student-request.service';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-secretary-initial-request',
  imports: [TableModule, CommonModule, PaginatorModule],
  standalone: true,
  templateUrl: './secretary-initial-request.component.html',
  styleUrl: './secretary-initial-request.component.css'
})


export class SecretaryInitialRequestComponent implements OnInit{
  requestReadData: RequestReadModel[] = [];
  statusId = 1;
  page = 0;
  pageSize = 3;
  totalRecords = 0;

  constructor (private studentRequestService: StudentRequestService){}

  ngOnInit() {
      this.loadRequest();
  }

  loadRequest(){
      this.studentRequestService.readRequest({
      statusId: this.statusId,
      pageNumber: this.page + 1,  
      pageSize: this.pageSize
    }).subscribe({
      next: (res) => {
        this.requestReadData = res.items;
        this.totalRecords = res.totalCount;
      },
      error: (err) => console.error('Failed to load requests', err)
    });
  }

  onPageChange(event: any) {
      console.log('Paginator event:', event);
    this.page = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadRequest();
  }
}
