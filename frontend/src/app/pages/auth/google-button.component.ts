import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "./button.component";

@Component({
  selector: "app-google-button",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button variant="secondary">
      <div>
        <svg
          width="49"
          height="33"
          viewBox="0 0 49 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_61_739)">
            <path
              d="M40.1187 17.0755C40.1187 15.7645 40.0123 14.8078 39.7821 13.8157H24.8115V19.733H33.5989C33.4218 21.2035 32.4651 23.4181 30.339 24.9062L30.3092 25.1043L35.0427 28.7713L35.3706 28.804C38.3824 26.0225 40.1187 21.9299 40.1187 17.0755Z"
              fill="#4285F4"
            />
            <path
              d="M24.8115 32.6662C29.1166 32.6662 32.7307 31.2488 35.3706 28.804L30.339 24.9062C28.9926 25.8452 27.1855 26.5007 24.8115 26.5007C20.5949 26.5007 17.0162 23.7193 15.7405 19.8748L15.5535 19.8906L10.6316 23.6997L10.5672 23.8787C13.1892 29.0873 18.5751 32.6662 24.8115 32.6662Z"
              fill="#34A853"
            />
            <path
              d="M15.7404 19.8747C15.4038 18.8826 15.209 17.8195 15.209 16.7211C15.209 15.6226 15.4038 14.5597 15.7227 13.5676L15.7138 13.3563L10.7302 9.48596L10.5672 9.56352C9.48649 11.725 8.86639 14.1522 8.86639 16.7211C8.86639 19.2901 9.48649 21.7172 10.5672 23.8786L15.7404 19.8747Z"
              fill="#FBBC05"
            />
            <path
              d="M24.8115 6.9415C27.8056 6.9415 29.8252 8.23481 30.9768 9.3156L35.4769 4.92183C32.7132 2.35292 29.1166 0.776123 24.8115 0.776123C18.5751 0.776123 13.1892 4.35487 10.5672 9.56354L15.7227 13.5676C17.0162 9.72305 20.5949 6.9415 24.8115 6.9415Z"
              fill="#EB4335"
            />
          </g>
          <defs>
            <clipPath id="clip0_61_739">
              <rect
                width="48"
                height="32"
                fill="white"
                transform="translate(0.5 0.776123)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
      <span>Continue with Google</span>
    </app-button>
  `,
})
export class GoogleButtonComponent {}
