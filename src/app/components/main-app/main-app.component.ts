import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account.service';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {

  constructor(private aService: AccountService, private router: Router) {
    if ( aService.isLogedIn() === false) { // 사용자의 상태가 로그인 상태가 아니라면 로그인 화면으로 보내버리기.
      router.navigate(['/']);
    }
    // console.log('AccountService logedIn : ' + aService.isLogedIn());
    // console.log('AccountService token : ' + aService.getToken());
  }

  ngOnInit() {
  }

  goback() {
    this.aService.reset();
    this.router.navigate(['/']);
  }
}
