import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="
        variant === 'primary'
          ? 'bg-neutral-500 text-white hover:bg-neutral-600'
          : 'bg-white text-neutral-500 hover:bg-gray-50'
      "
      class="flex items-center justify-center gap-2.5 px-5 py-6 text-xl font-bold tracking-tight leading-5 border-t border-r border-l border-solid shadow-sm cursor-pointer border-t-black border-x-black min-w-[216px] rounded-[100px] max-md:px-4 max-md:py-5 max-md:text-lg max-sm:px-3 max-sm:py-4 max-sm:w-full max-sm:text-base"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: "primary" | "secondary" = "primary";
  @Input() type: "button" | "submit" | "reset" = "button";
}
