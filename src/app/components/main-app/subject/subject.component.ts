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
    styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {
    @Input() projectId: string;
    // @Input() subject: Interface.ISubject = {};
    @Input()
    set subjectId(value: string) {
        this._subjectId = value;
        this.subscribeSubject(value);
    }
    get subjectId() {
        return this._subjectId;
    }
    @Input() isNewMode      = false; // 리스트에서 새로운 값을 입력받기 전에 대기 모드 출력.
    @Input() isToolbarMode  = false; // 툴바에 간이 기능 제공할 지 결정.
    @Input() isFolded       = false; // 서브젝트를 접을 것인지 결정.
    @Input() order:         EventEmitter<Interface.IOrderMsg>;
    @Output() output:       EventEmitter<any> = new EventEmitter();

    private isEditTitle = false;
    private subject:              Interface.ISubject = {};
    private _subjectId:           string;
    private itemList:             Interface.IItem[];
    private orderChild:           EventEmitter<Interface.IOrderMsg> = new EventEmitter();
    private subjectSubscription:  Subscription;
    private itemListSubscription: Subscription;

    constructor(
        private http: HttpClient,
        private aService: AccountService,
        private store: Store<Redux.StoreInfo>) { }

    ngOnInit() {
        this.subscribeEventFromParent();
    }

    // 화면에서 서브젝트의 타이틀을 변경할 때 사용되는 함수에요.
    saveTitle($event) {
        if ($event['key'] === 'Enter') {
            console.log($event);
            this.subject.title = $event.target.value;
            this.isEditTitle = false;
            this.http.put(
                SysConf.UPDATE_SUBJECT + '?' +
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

    // 서버로 새로운 Subject를 생성하기위해 전송해요.
    sendNewSubject($event) {
        if ($event['key'] === 'Enter') {
            this.isEditTitle = false;
            this.subject.project_id = this.projectId;
            this.subject.writer_id = this.aService.getUserInfo().id;
            this.subject.title = $event.target.value;

            this.http.post(
                SysConf.INSERT_SUBJECT + '?' +
                'key=' + this.aService.getToken(),
                this.subject)
                .subscribe(obs => {
                    console.log(obs);
                    this.store.dispatch(new Reducers.subject.AddAct(obs));
                });
        }
    }

    // isFolded의 상태를 반대 상태로 변경해줘요.
    changeIsFolded(event) {
        event.stopPropagation();
        this.isFolded = !this.isFolded;
    }

    // isEditTitle의 상태를 주어진 상태로 변경해줘요.
    changeIsEditTitle(event, type) {
        event.stopPropagation();
        this.isEditTitle = type;
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

    // 부모로부터 받은 EventEmitter를 구독해요.
    // ClickEvent라던지, mouseOver등의 이벤트들 이에요.
    private subscribeEventFromParent() {
        if (this.order !== undefined && this.order !== null) {
        this.order.subscribe(obs => {
            // console.log(obs);
            this.clickEvent(obs);
        });
        }
    }

    // 리덕스의 SubjectList를 구독해요.
    private subscribeSubject(subjectId: string) {
        if (subjectId !== undefined &&
            subjectId !== null &&
            subjectId !== '') {
            this.unSubscribe(this.subjectSubscription);
            this.subjectSubscription = this.store.select(Redux.getSubjectList)
                .subscribe(obs => {
                    this.subject = obs.find(value => {
                        return value._id === subjectId;
                    });

                    // subjectList가 구독되고 나서 ItemList가 구독되어야 순서가 맞으므로..
                    this.subscribeItemList(subjectId);

                });
        }
    }

    // 리덕스의 ItemList를 구독해요.
    private subscribeItemList(subjectId: string) {
        this.unSubscribe(this.itemListSubscription);
        this.itemListSubscription = this.store.select(Redux.getItemList)
            .subscribe(obs => {
                this.itemList = obs.filter(value => {
                return subjectId === value.subject_id;
                });
            });
    }

    // 파워 구독 해제!!
    private unSubscribe(subscription: Subscription) {
        if (subscription !== undefined && subscription !== null) {
            subscription.unsubscribe();
        }
    }

    // 포풍 파괴!!
    ngOnDestroy() {
        // this.store.dispatch(new Reducers.itemList.RemoveAllAct());
        this.unSubscribe(this.subjectSubscription);
        this.unSubscribe(this.itemListSubscription);
    }
}
