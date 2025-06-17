import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { Image } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { StudentRequestService } from '@shared/_services';
import { RequestService } from 'app/features/_services/request-service';

type UploadField = 'imageProof' | 'parentsValidId' | 'medicalCertificate';

@Component({
  selector: 'app-supporting-documents',
  standalone: true,
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    CardModule,
    Image,
    ButtonModule,
  ],
  providers: [MessageService],
})
export class SupportingDocumentsComponent implements OnInit {
  @ViewChild('imageProofUploader') imageProofUploader!: FileUpload;
  @ViewChild('parentsValidIdUploader') parentsValidIdUploader!: FileUpload;
  @ViewChild('medicalCertificateUploader')
  medicalCertificateUploader!: FileUpload;

  formGroup!: FormGroup;

  imagePreviews: Record<UploadField, string> = {
    imageProof: '',
    parentsValidId: '',
    medicalCertificate: '',
  };

  tokenData: any = null;
  isExpired = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    const token =
      this.route.snapshot.queryParamMap.get('token') ||
      sessionStorage.getItem('dlarsToken');

    if (!token) {
      console.error('No token provided');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now();
      const expiration = decoded.exp * 1000;

      if (expiration < now) {
        this.isExpired = true;
        console.warn('Token expired');
      } else {
        this.tokenData = decoded;
        sessionStorage.setItem('dlarsToken', token);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        });
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }

    this.formGroup = this.fb.group({
      imageProof: [''],
      parentsValidId: [''],
      medicalCertificate: [''],
    });
  }

  selectedFiles: Record<UploadField, File | null> = {
    imageProof: null,
    parentsValidId: null,
    medicalCertificate: null,
  };

  handleFile(event: any, field: UploadField) {
    const file: File = event.files[0];
    if (file) {
      this.selectedFiles[field] = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[field] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearAll() {
    this.formGroup.reset();

    this.imagePreviews = {
      imageProof: '',
      parentsValidId: '',
      medicalCertificate: '',
    };

    this.imageProofUploader?.clear();
    this.parentsValidIdUploader?.clear();
    this.medicalCertificateUploader?.clear();
  }

  submitImages() {
    if (!this.tokenData?.requestId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Request ID',
        detail: 'No request ID was found in the token.',
      });
      return;
    }
    if (!this.selectedFiles.imageProof || !this.selectedFiles.parentsValidId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Required Files',
        detail: 'Image proof and parent valid ID are required.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('RequestId', this.tokenData.requestId);
    formData.append('StatusId', '3');

    formData.append('ProofImage', this.selectedFiles.imageProof);
    formData.append('ParentValidImage', this.selectedFiles.parentsValidId);

    if (this.selectedFiles.medicalCertificate)
      formData.append(
        'MedicalCertificate',
        this.selectedFiles.medicalCertificate
      );

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.requestService.addImageProofInRequest(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Uploaded',
          detail: 'Files uploaded successfully',
        });
        this.clearAll();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Upload failed',
        });
        console.error(err);
      },
    });
  }
}
