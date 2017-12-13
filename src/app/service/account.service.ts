import { Injectable } from '@angular/core';

@Injectable()
export class AccountService {
  private token: string;
  private logedIn: boolean;
  private userInfo: {};

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

  setUserInfo(userInfo: {}) {
    this.userInfo = userInfo;
  }

  getToken(): string {
    return this.token;
  }

  getUserInfo(): {} {
    return this.userInfo;
  }

  isLogedIn(): boolean {
    if (this.logedIn === true && this.token !== '' &&
        this.token !== undefined && this.token !== null) {
      return true;
    } else {
      return false;
    }
  }

  reset() {
    this.token = '';
    this.logedIn = false;
    this.userInfo = {};
  }
}
