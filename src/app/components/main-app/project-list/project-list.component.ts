import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import { AccountService } from '../../../service/account.service';
import { SysConf } from '../../../service/sysConfig';
import { IOrderMsg } from '../../../service/Interface';
import { StoreInfo, getProjectList } from '../../../service/redux/storeInfo';
import Reducers from '../../../service/redux/reducers';
import * as Interface from '../../../service/Interface';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projectList: Interface.IProject[];
  projectListSubscription: Subscription;
  orderChild: EventEmitter<IOrderMsg> = new EventEmitter();

  constructor(private aService: AccountService,
              private http: HttpClient,
              public store: Store<StoreInfo>) {
  }

  ngOnInit() {
    console.log(`ProjectList ngOnInit()`);
    this.projectListSubscription = this.store.select(getProjectList).subscribe(obs => {
      this.projectList = obs;
    });
    this.loadProjectList();
  }


  private loadProjectList() {
    this.http.get<Interface.IProject[]>(SysConf.GET_PROJECT_LIST + '?' +
                  'key=' + this.aService.getToken() + '&' +
                  'id=' + this.aService.getUserInfo()['id'])
    .subscribe(obs => {
      // console.log(obs);
      if (obs !== undefined && obs.length > 0) {
        this.store.dispatch(new Reducers.project.InsertNew(obs));
      }
    });
  }

  private receiveRequest($event) {
    // console.log(`project-list.components.ts: receiveRequest(): ${ JSON.stringify($event) }`);
    if ($event['request'] === SysConf.GET_PROJECT_LIST_FROM_SERVER) {
      this.loadProjectList();
    }
  }

  // 화면에 켜져있는 작은 메뉴들을 화면에서 숨겨주는 함수에요.
  private clickEvent(event) {
    // this.orderChild.emit({ request: SysConf.CLOSE_LAYER, object: event });
    this.orderChild.emit({ request: SysConf.CLICK_EVENT, object: event });
    // console.log(`test`);
  }

  ngOnDestroy() {
    // console.log(`CALLED ngOnDestory()`);
    if (this.projectListSubscription !== undefined) {
      this.projectListSubscription.unsubscribe();
    }
  }
}
