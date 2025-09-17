import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ModalComponent } from './components/modal/modal.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ModalComponent,
    ToastComponent
  ],
  imports: [
    CommonModule
  ],
  // Add this exports array
  exports: [
    LoadingSpinnerComponent,
    ModalComponent,
    ToastComponent
  ]
})
export class SharedModule { }