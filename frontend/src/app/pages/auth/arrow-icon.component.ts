import { Component } from "@angular/core";

@Component({
  selector: "app-arrow-icon",
  template: `
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="arrow-icon"
    >
      <path
        d="M2.66699 8H13.3337"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M8.66699 3.33337L13.3337 8.00004L8.66699 12.6667"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  `,
  standalone: true,
})
export class ArrowIconComponent {}
