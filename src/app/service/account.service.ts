import { Injectable } from '@angular/core';

@Injectable()
export class AccountService {
  private token: string;
  private logedIn: boolean;

  constructor() {
    this.token = '';
    this.logedIn = false;
  }

  setToken(token: string) {
    this.token = token;
  }

  setLogedIn(state: boolean) {
    this.logedIn = state;
  }

  getToken(): string {
    return this.token;
  }

  isLogedIn(): boolean {
    if (this.logedIn === true && this.token !== '' &&
        this.token !== undefined && this.token !== null) {
      return true;
    } else {
      return false;
    }
  }
}
