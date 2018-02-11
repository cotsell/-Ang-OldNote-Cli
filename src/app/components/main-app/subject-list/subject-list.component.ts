import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import { StoreInfo, getProjectList } from '../../../service/redux/storeInfo';
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
  projectSubscription: Subscription;
  projectId: string;

  constructor(private aService: AccountService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private store: Store<StoreInfo>) {
    // this.project._id = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
    this.projectSubscription = this.store.select(getProjectList)
      .subscribe(obs => {
        this.project = obs.find(value => {
          return value._id === this.projectId;
        });
      });
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

      // TODO 삭제 예정
      case SysConf.GET_PROJECT_LIST_FROM_SERVER :
        // this.getProject(); // TODO
        break;
    }
  }

  orderChildEvent(event) {
    // console.log(event);
    this.orderChild.emit({ request: SysConf.CLICK_EVENT, object: event });
  }
}
