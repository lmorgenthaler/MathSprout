import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { CloudIconComponent } from "./cloud-icon.component";
import { FileUploadService } from "../../services/file-upload.service";

@Component({
  selector: "app-drag-drop-area",
  standalone: true,
  imports: [CommonModule, CloudIconComponent],
  template: `
    <section
      class="flex flex-col justify-center items-center p-5 bg-white border-dashed border-[6.23px] border-slate-300 h-[302px] rounded-[40.497px] w-[358px] max-md:h-auto max-md:min-h-[250px] max-md:w-[90%] max-sm:p-4"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      [class.border-blue-500]="isDragging"
    >
      <div class="mb-8 h-[52px] w-[55px]">
        <app-cloud-icon></app-cloud-icon>
      </div>
      <p
        class="mb-5 text-base font-medium text-center text-zinc-800 max-sm:text-sm"
      >
        Choose a file or drag & drop it here
      </p>
      <p
        class="mb-5 text-base font-medium text-center text-gray-400 max-sm:text-sm"
      >
        Excel, CSV files up to 50 MB
      </p>
      <input
        type="file"
        #fileInput
        class="hidden"
        (change)="onFileSelected($event)"
        accept=".xlsx,.xls,.csv"
      />
      <button
        class="px-6 py-3 text-base font-medium text-center rounded-3xl border-solid cursor-pointer border-[3.115px] border-slate-300 text-zinc-600 max-sm:text-sm"
        (click)="fileInput.click()"
        [disabled]="isUploading"
        [class.opacity-50]="isUploading"
      >
        {{ isUploading ? 'Uploading...' : 'Browse Files' }}
      </button>

      <!-- Upload Progress -->
      <div *ngIf="uploadProgress$ | async as progress" class="mt-4 w-full">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            [style.width.%]="progress.progress"
          ></div>
        </div>
        <p class="text-sm text-center mt-2" [class.text-red-500]="progress.status === 'error'">
          {{ getProgressMessage(progress) }}
        </p>
      </div>
    </section>
  `,
})
export class DragDropAreaComponent {
  isDragging = false;
  isUploading = false;
  uploadProgress$ = this.fileUploadService.uploadProgress$;

  constructor(
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private async handleFile(file: File) {
    try {
      this.isUploading = true;
      await this.fileUploadService.uploadFile(file);
      // Wait for the upload to complete
      this.uploadProgress$.subscribe(progress => {
        if (progress.status === 'completed') {
          this.router.navigate(['/dashboard']);
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      this.isUploading = false;
    }
  }

  getProgressMessage(progress: any): string {
    switch (progress.status) {
      case 'uploading':
        return `Uploading... ${progress.progress}%`;
      case 'completed':
        return 'Upload completed successfully!';
      case 'error':
        return progress.error || 'Upload failed';
      default:
        return '';
    }
  }
}
