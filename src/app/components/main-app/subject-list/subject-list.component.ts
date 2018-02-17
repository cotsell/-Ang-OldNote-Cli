import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import * as Redux from '../../../service/redux/storeInfo';
import { AccountService } from '../../../service/account.service';
import * as Interface from '../../../service/Interface';
import { SysConf } from '../../../service/sysConfig';
import Reducers from '../../../service/redux/reducers';
import { NetworkService } from '../../../service/network.service';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit, OnDestroy {
  projectId: string;
  project: Interface.IProject
            = { _id: undefined, title: undefined, writer_id: undefined, num: undefined};
  subjectList: Interface.ISubject[];
  itemList: Interface.IItem[];
  orderChild: EventEmitter<Interface.IOrderMsg> = new EventEmitter();
  projectSubscription: Subscription;
  subjectListSubscription: Subscription;

  constructor(private aService: AccountService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private network: NetworkService,
              private store: Store<Redux.StoreInfo>) {
    // this.project._id = route.snapshot.params['id'];
  }

  ngOnInit() {
    // ProjectList 구독합니다.
    // Project Component에서 라우터를 통해 Project의 id값을 받았기 때문에,
    // 리덕스에서 값을 가져와서 쓰도록 합니다.
    this.projectId = this.route.snapshot.params['id'];
    this.projectSubscription = this.store.select(Redux.getProjectList)
      .subscribe(obs => {
        this.project = obs.find(value => {
          return value._id === this.projectId;
        });
      });
    // 리덕스에서 SubjectList를 구독.
    this.subjectListSubscription = this.store.select(Redux.getSubjectList)
      .subscribe(obs => {
        this.subjectList = obs;
      });
    // 리덕스에서 ItemList를 구독.
    this.store.select(Redux.getItemList)
      .subscribe(obs => {
        this.itemList = obs;
      });
    this.getSubjectList();

  }

  // 서버로 서브젝트 리스트을 요청합니다. project의 id필요.
  private getSubjectList() {
    this.network.getSubjectList(this.projectId)
      .subscribe( obs => {
        if (obs.length > 0 && obs !== undefined) {
          this.store.dispatch(new Reducers.subject.InsertNewAct(obs));
          this.getItemList();
        }
      });
  }

  // 서버로 서브젝트들의 id에 해당하는 itemList를 요청합니다. subject들의 id필요.
  private getItemList() {
    this.network.getItemListWithSubjects(this.subjectList)
      .subscribe(obs => {
        if (obs !== undefined && obs.length > 0) {
        this.store.dispatch(new Reducers.itemList.InsertNewAct(obs));
        }
      });
  }

  receiveOutput(event: Interface.IOutputMsg) {
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

  ngOnDestroy() {
    this.store.dispatch(new Reducers.subject.RemoveAllAct());
    this.store.dispatch(new Reducers.itemList.RemoveAllAct());


    if (this.projectSubscription !== undefined) {
      this.projectSubscription.unsubscribe();
    }
    if (this.subjectListSubscription !== undefined) {
      this.subjectListSubscription.unsubscribe();
    }
  }
}
