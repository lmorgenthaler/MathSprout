import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArrowIconComponent } from "./arrow-icon.component";

@Component({
  selector: "app-action-button",
  template: `
    <button
      (click)="onClick()"
      class="flex gap-2.5 justify-between items-center px-5 py-6 text-xl font-bold tracking-tight leading-5 text-white border-t border-r border-l border-solid shadow-sm cursor-pointer bg-neutral-500 border-t-black border-x-black min-w-[216px] rounded-[100px] max-md:px-4 max-md:py-5 max-md:text-lg max-sm:px-3 max-sm:py-4 max-sm:w-full max-sm:text-base"
    >
      <span>{{ text }}</span>
      <app-arrow-icon />
    </button>
  `,
  standalone: true,
  imports: [CommonModule, ArrowIconComponent],
})
export class ActionButtonComponent {
  @Input() text: string = "";

  onClick() {
    // Handle click event
    console.log(`Button clicked: ${this.text}`);
  }
}
