import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.css'
})

export class ErrorModalComponent {
  @Input() errorMessage: string = '';

  constructor(public activeModal: NgbActiveModal) { }
}