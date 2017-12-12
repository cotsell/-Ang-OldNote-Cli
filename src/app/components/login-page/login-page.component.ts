import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SysConf } from '../../service/sysConfig';
import { AccountService } from '../../service/account.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  isWatch = false;
  directLoginForm: FormGroup = new FormGroup(
    {
      id: new FormControl(),
      password: new FormControl()
    }
  );

  constructor(private aService: AccountService, private http: Http,
    private route: ActivatedRoute, private router: Router) {
    // 1. AccountService의 logedIn상태가 true면 곧바로 main-app으로 이동.
    // 2. '/'에 'key'쿼리가 존재하면, 토큰 유효성 체크하고 main-app으로 이동.

    // 1.을 만들어 두긴 했는데, 이런 경우는 일어나질 않음..
    // TODO: 쿠키에 토큰이 존재하면, 가져와서 AccountService를 갱신, main-app으로
    // TODO: 이동하는 내용으로 코드를 바꾸자.
    if (aService.isLogedIn() === true) { router.navigate([SysConf.MAIN_APP]); }

    // param이 아닌, query로 데이터를 받는 경우의 처리.
    const token = route.snapshot.queryParams['key'];
    if (token !== undefined && token !== null) {
      console.log('토큰 유효성을 체크합니다. token -> ' + token);

      const jwtLogin = (observ) => {
        console.log(JSON.stringify(observ));
        if (observ !== undefined && observ !== null &&
          observ['loginResult'] === true && observ['key'] !== '') {
            aService.setToken(observ['key']);
            aService.setLogedIn(true);
            // TODO: 라우트 가드 설정하기.
            this.router.navigate([SysConf.MAIN_APP]);
          } else {
          if (observ === undefined || observ === null) {
            console.log('접속 장애가 발생한 듯 합니다.');
          }
          if (observ['loginResult'] === false) {
            console.log(observ['msg']);
          }
        }
      };

      http.get(SysConf.JWT_TOKEN_CHECK_ADDRESS + '?key=' + token)
      .map( r => r.json() )
      .subscribe(jwtLogin);
    }
  }

  ngOnInit() {
  }

  callJoinPage() {
    this.isWatch = !this.isWatch;
  }

  // 구글 계정으로 로그인하기 위한 처리.
  googleLogin() {
    this.http.get(SysConf.GOOGLE_LOGIN_ADDRESS)
    .map( r => r.json() )
    .subscribe(observ => {
      console.log(observ);
      window.location.replace(observ);
    });
  }

  // 기본 계정 로그인.
  directLogin() {
    const url = SysConf.DIRECT_LOGIN_ADDRESS +
    '?id=' + this.directLoginForm.value['id'] + '&' +
    'password=' + this.directLoginForm.value['password'];
    // console.log('기본 계정 로그인.' + url);

    this.http.get(url)
    .map( r => r.json() )
    .subscribe((obs) => {
      console.log(obs);
      if (obs['loginResult'] === true && obs['key'] !== '' &&
          obs['key'] !== undefined && obs['key'] !== null) {
            // TODO: 라우팅 가드 설정.
            this.aService.setToken(obs['key']);
            this.aService.setLogedIn(true);
            this.router.navigate([SysConf.MAIN_APP]);
      } else {
        if (obs['loginResult'] === false) { console.log(obs['msg']); }
      }
    });
  }
}
