// error-handler.service.ts
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from './error-modal/error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private modalService: NgbModal) {}

  handleError(errorMessage: string) {
    console.error(errorMessage);
    const errorModal = this.modalService.open(ErrorModalComponent);
    errorModal.componentInstance.errorMessage = errorMessage;
  }
}