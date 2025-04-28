import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-input-field",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative mb-6">
      <input
        [type]="type"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)"
        class="px-4 py-0 w-full text-base bg-white rounded-lg border border-solid border-neutral-300 h-[58px] max-sm:h-[50px]"
        [attr.aria-label]="placeholder"
      />
      <ng-content></ng-content>
    </div>
  `,
})
export class InputFieldComponent {
  @Input() type: string = "text";
  @Input() placeholder: string = "";
  @Input() value: string = "";
  @Output() valueChange = new EventEmitter<string>();
}
