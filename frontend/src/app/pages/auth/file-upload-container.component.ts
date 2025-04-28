import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileUploadCardComponent } from "./file-upload-card.component";

@Component({
  selector: "app-file-upload-container",
  standalone: true,
  imports: [CommonModule, FileUploadCardComponent],
  template: `
    <main
      class="flex justify-center items-center w-full min-h-screen bg-gray-200"
    >
      <section
        class="flex flex-col gap-5 items-center p-5 w-full max-w-[608px] max-md:max-w-[90%]"
      >
        <h1
          class="text-5xl tracking-wider leading-10 text-center text-amber-100 max-sm:text-4xl"
        >
          MathSprout
        </h1>
        <app-file-upload-card></app-file-upload-card>
      </section>
    </main>
  `,
})
export class FileUploadContainerComponent {}
