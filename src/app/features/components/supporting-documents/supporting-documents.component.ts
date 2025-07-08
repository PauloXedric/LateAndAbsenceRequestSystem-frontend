import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { Image } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { RequestService } from '@features/_services/request.service';
import { TokenLinkService } from '@core';
import { DateFormatPipe } from '@shared/_pipes/date-format.pipe';
import { ToastModule } from 'primeng/toast';
import { RequestStatusEnum } from '@shared/_enums';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ToastService } from '@shared/_services';
import { CopyrightComponent } from '@shared/components';

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
    DateFormatPipe,
    ToastModule,
    DividerModule,
    CopyrightComponent,
  ],
  providers: [MessageService],
})
export class SupportingDocumentsComponent implements OnInit {
  @ViewChild('imageProofUploader') imageProofUploader!: FileUpload;
  @ViewChild('parentsValidIdUploader') parentsValidIdUploader!: FileUpload;
  @ViewChild('medicalCertificateUploader')
  medicalCertificateUploader!: FileUpload;

  formGroup!: FormGroup;
  readonly RequestStatusEnum = RequestStatusEnum;

  imagePreviews: Record<UploadField, string> = {
    imageProof: '',
    parentsValidId: '',
    medicalCertificate: '',
  };

  tokenData: any = null;
  isExpired = false;
  isSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private requestService: RequestService,
    private tokenLinkService: TokenLinkService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      imageProof: [''],
      parentsValidId: [''],
      medicalCertificate: [''],
    });

    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.tokenLinkService.setToken(token);
      const cleanUrl = this.router.url.split('?')[0];
      this.location.replaceState(cleanUrl);
    }

    const decoded = this.tokenLinkService.decodeToken();
    if (!decoded) {
      console.error('No valid token found');
      return;
    }

    this.tokenData = decoded;
    this.isExpired = this.tokenLinkService.isTokenExpired();

    if (this.tokenData?.requestId) {
      this.requestService
        .getSubmittedStatus(this.tokenData.requestId)
        .subscribe({
          next: (result) => {
            this.isSubmitted = result;
          },
          error: (err) => {
            console.error('Failed to check submitted status', err);
          },
        });
    }
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

    this.toastService.showInfo('Supporting documents cleared.');
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
    formData.append(
      'StatusId',
      RequestStatusEnum.WaitingForSecondSecretaryApproval.toString()
    );

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
      next: (success) => {
        if (success) {
          this.toastService.showSuccess(
            'Successfully added. Please wait for further approval.'
          );
          this.isSubmitted = true;
        } else {
          this.toastService.showError('Submission failed.');
        }
      },
      error: (err) => {
        this.toastService.showError('An error occurred while submitting.');
        console.error(err);
      },
    });
  }
}
