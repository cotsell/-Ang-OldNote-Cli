import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import { SysConf } from '../../../service/sysConfig';
import { AccountService } from '../../../service/account.service';
import { Subject } from 'rxjs/Subject';
import * as Interface from '../../../service/Interface';
import Reducers from '../../../service/redux/reducers';
import * as Redux from '../../../service/redux/storeInfo';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  @Input() subject: Interface.ISubject = {};
  @Input() isNewMode = false;
  @Input() order: EventEmitter<Interface.IOrderMsg>;
  @Output() output: EventEmitter<any> = new EventEmitter();
  private itemList: Interface.IItem[];
  private orderChild: EventEmitter<Interface.IOrderMsg> = new EventEmitter();
  private isEditTitle = false;
  private itemListSubscription: Subscription;

  constructor(private http: HttpClient,
              private aService: AccountService,
              private store: Store<Redux.StoreInfo>) { }

  ngOnInit() {
    if (this.order !== undefined && this.order !== null) {
      this.order.subscribe(obs => {
        // console.log(obs);
        this.clickEvent(obs);
      });
    }

    this.store.select(Redux.getItemList)
      .subscribe(obs => {
        this.itemList = obs.filter(value => {
          return this.subject._id === value.subject_id;
        });
      });
  }

  // 화면에서 서브젝트의 타이틀을 변경할 때 사용되는 함수.
  saveTitle($event) {
    if ($event['key'] === 'Enter') {
      console.log($event);
      this.subject.title = $event.target.value;
      this.isEditTitle = false;
      this.http.put(SysConf.UPDATE_SUBJECT + '?' +
                    'key=' + this.aService.getToken(),
                    { _id: this.subject._id, title: this.subject.title })
      .subscribe(obs => {
        console.log(obs);
        this.store.dispatch(new Reducers.subject.ModifyAct(this.subject));
      });
    }
  }

  // TODO 삭제예정
  receiveOutput($event) {
    this.output.emit($event);
  }

  focusOn($event) {
    $event.focus();
  }

  sendNewSubject($event) {
    if ($event['key'] === 'Enter') {
      this.isEditTitle = false;
      this.subject.project_id = this.projectId;
      this.subject.writer_id = this.aService.getUserInfo().id;
      this.subject.title = $event.target.value;

      this.http.post(SysConf.INSERT_SUBJECT + '?' +
                      'key=' + this.aService.getToken(),
                      this.subject)
      .subscribe(obs => {
        console.log(obs);
        this.store.dispatch(new Reducers.subject.AddAct(obs));
      });
    }
  }

  clickEvent(event: Interface.IOrderMsg) {
    this.orderChild.emit({ request: event.request, object: event.object });
  }

  // TODO 삭제예정
  showMiniMenuButton() {
    this.orderChild.emit({ request: SysConf.SHOW_MINI_MENU_BUTTON });
  }

  // TODO 삭제예정
  hideMiniMenuButton() {
    this.orderChild.emit({ request: SysConf.HIDE_MINI_MENU_BUTTON });
  }

  ngOnDestroy() {
    // this.store.dispatch(new Reducers.itemList.RemoveAllAct());
    if (this.itemListSubscription !== undefined) {
      this.itemListSubscription.unsubscribe();
    }
  }
}
