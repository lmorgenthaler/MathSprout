import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UploadIconComponent } from "./upload-icon.component";
import { DragDropAreaComponent } from "./drag-drop-area.component";

@Component({
  selector: "app-file-upload-card",
  standalone: true,
  imports: [CommonModule, UploadIconComponent, DragDropAreaComponent],
  template: `
    <article class="flex flex-col items-center p-6 w-full bg-white rounded-3xl">
      <h2
        class="mb-5 text-2xl font-bold leading-9 text-center text-zinc-800 max-sm:text-xl"
      >
        Create your Classroom
      </h2>
      <section class="flex flex-col gap-5 items-center w-full">
        <div class="mb-5 h-[57px] w-[489px] max-md:w-full max-md:h-auto">
          <app-upload-icon></app-upload-icon>
        </div>
        <app-drag-drop-area></app-drag-drop-area>
      </section>
    </article>
  `,
})
export class FileUploadCardComponent {}
