export interface SignupFormData {
  username: string;
  password: string;
  [key: string]: unknown;
}

export interface SignupFormElements {
  emailInput: HTMLElement;
  passwordInput: HTMLElement;
  confirmPasswordInput: HTMLElement;
  signupButton: HTMLElement;
}
