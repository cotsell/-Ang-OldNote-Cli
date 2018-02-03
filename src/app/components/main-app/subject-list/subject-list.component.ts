import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AccountService } from '../../../service/account.service';
import { IProject, IOrderMsg, IOutputMsg } from '../../../service/Interface';
import { SysConf } from '../../../service/sysConfig';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {
  project: IProject = { _id: undefined, title: undefined, writer_id: undefined, num: undefined};
  subjectList;
  orderChild: EventEmitter<IOrderMsg> = new EventEmitter();

  constructor(private aService: AccountService,
              private route: ActivatedRoute,
              private http: HttpClient) {
    this.project._id = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getProject();
    this.getSubjectList();
  }

  // 서버로 서브젝트 리스트을 요청합니다. project의 id필요.
  private getSubjectList() {
    this.http.get(SysConf.GET_SUBJECT_LIST + '?' +
                  'key=' + this.aService.getToken() + '&' +
                  'id=' + this.project._id)
    .subscribe( obs => {
      this.subjectList = this.organize(obs);
    });
  }

  // 서버로 프로젝트의 내용을 요청합니다.
  private getProject() {
    this.http.get(SysConf.GET_PROJECT + '?' +
                  'key=' + this.aService.getToken() + '&' +
                  'project_id=' + this.project._id)
    .subscribe(obs => {
      // console.log(obs);
      this.project.title = obs['title'];
      this.project.writer_id = obs['writer_id'];
      this.project.num = obs['num'];
    });
  }

  // sd
  organize(json) {
    const result: any[] = [];
    for (let i = 0; i < json['subjects'].length; i++) {
      result.push(json['subjects'][i]);
      result[i]['items'] = json['items'].filter((element) => {
        return element['subject_id'] === json['subjects'][i]['_id'];
      });
    }
    // console.log(result);
    return result;
  }

  receiveOutput(event: IOutputMsg) {
    switch (event.request) {
      case SysConf.GET_SUBJECT_LIST_FROM_SERVER :
        this.getSubjectList();
        break;

      case SysConf.GET_PROJECT_LIST_FROM_SERVER :
        this.getProject();
        break;
    }
  }

  orderChildEvent(event) {
    // console.log(event);
    this.orderChild.emit({ request: SysConf.CLICK_EVENT, object: event });
  }
}
