import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { SysConf } from '../../../service/sysConfig';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  directSignForm: FormGroup = new FormGroup(
    {
      id: new FormControl(),
      display_name: new FormControl(),
      password: new FormControl(),
      confirm_password: new FormControl()
    }
  );

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {}

  directSign() {
    // TODO: 데이터 전송 전에 문제 없는지 확인 필요.
    const url = SysConf.DIRECT_SIGN_ADDRESS + '?' +
    'id=' + this.directSignForm.value['id'] + '&' +
    'password=' + this.directSignForm.value['password'] + '&' +
    'display_name=' + this.directSignForm.value['display_name'];
    // console.log('다이렉트 가입' + url);
    this.http.get(url)
    .subscribe(observ => {
      console.log(observ);
      window.location.replace('/');
    });
  }

  signWithGoogleId() {
    // console.log('구글가입');
    this.http.get(SysConf.GOOGLE_SIGN_ADDRESS)
    .subscribe(observ => {
      console.log(observ);
      window.location.replace(observ['result']);
    });
  }
}
