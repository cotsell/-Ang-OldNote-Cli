/*
  두가지 모드로 이용 가능해요.
  1. 새로운 서브젝트를 입력 받을 수 있는 모드.
  2. 부모가 넘겨주는 서브젝트를 출력하는 모드.

  1번 모드로 사용하기 위해서는 projectId, isNewMode=true가 필수 입력이에요.
  2번 모드로 사용하기 위해서는 projectId, subject, order가 필수 입력이에요.
    order는 부모에서 발생한 클릭 이벤트 등을 넘겨주는 프로퍼티에요.
    만약 서브젝트를 접어 놓은 모드로 시작하려면, isFolded=true를 사용해주세요.
*/

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
  @Input() isFolded = false; // 서브젝트를 접을 것인가
  @Output() output: EventEmitter<any> = new EventEmitter();
  private itemList: Interface.IItem[];
  private orderChild: EventEmitter<Interface.IOrderMsg> = new EventEmitter();
  private isEditTitle = false;
  private itemListSubscription: Subscription;

  constructor(
    private http: HttpClient,
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

  changeIsFolded(event) {
    event.stopPropagation();
    this.isFolded = !this.isFolded;
  }

  clickEvent(event: Interface.IOrderMsg) {
    this.orderChild.emit({ request: event.request, object: event.object });
  }

  showMiniMenuButton() {
    this.orderChild.emit({ request: SysConf.SHOW_MINI_MENU_BUTTON });
  }

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
