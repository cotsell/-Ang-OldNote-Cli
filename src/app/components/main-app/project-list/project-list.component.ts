import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AccountService } from '../../../service/account.service';
import { SysConf } from '../../../service/sysConfig';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projectList = [];


  constructor(private aService: AccountService, private http: Http) {

  }

  ngOnInit() {
    this.loadProjectList();
  }


  private loadProjectList() {
    this.http.get(SysConf.GET_PROJECT_LIST + '?' +
                  'key=' + this.aService.getToken() + '&' +
                  'id=' + this.aService.getUserInfo()['id'])
    .map(r => r.json())
    .subscribe(obs => {
      // console.log(obs);
      this.projectList = obs;
    });
  }
}
