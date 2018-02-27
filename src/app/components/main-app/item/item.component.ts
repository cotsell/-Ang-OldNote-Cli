import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { AccountService } from '../../../service/account.service';
import { uuid } from '../../../service/utils';
import { SysConf } from '../../../service/sysConfig';
import { IItem, IOutputMsg, IOrderMsg, IProject, ISubject } from '../../../service/Interface';
import { AddAct } from '../../../service/redux/reducers/itemListReducer';
import * as Redux from '../../../service/redux/storeInfo';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
    @Input() isNewItem      = false;
    private isInsertMode    = false;

    @Input() item:      IItem;
    @Input() projectId: string;
    @Input() subject:   ISubject;
    @Input() order:     EventEmitter<IOrderMsg>;
    @Output() output:   EventEmitter<any>       = new EventEmitter(); // TODO 삭제예정
    orderChild:         EventEmitter<IOrderMsg> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private aService: AccountService,
        private store: Store<Redux.StoreInfo>) { }

    ngOnInit() {
        if (this.order !== undefined && this.order !== null) {
            this.order.subscribe(obs => {
                const msg: IOrderMsg = obs;
                // console.log(`item.component.ts: ngOnInit(): obs is`);
                // console.log(obs);
                if (msg.request === SysConf.CLICK_EVENT) {
                    this.clickEvent(obs);
                }
            });
        }
    }

    // 새로운 Item을 입력하기 위해, 서버로 저장 요청하는 함수에요.
    sendNewItem($event) {
        if ($event.key === 'Enter') {
            const newItem: IItem = {
                project_id: this.projectId,
                subject_id: this.subject._id,
                title: $event.target.value,
                writer_id: this.aService.getUserInfo().id,
                checkbox_list: { id: uuid(), title: 'CheckBox List', list: [] }
            };
            this.isInsertMode = false;
            // console.log(newItem);
            this.http.post(
                SysConf.INSERT_ITEM + '?' +
                'key=' + this.aService.getToken(),
                newItem)
            .subscribe(obs => {
                console.log(obs);
                this.store.dispatch(new AddAct(obs));
            });
        }
    }

    focusOn(element) {
        element.focus();
    }

    orderShowMiniMenuButton() {
        this.orderChild.emit({ request: SysConf.SHOW_MINI_MENU_BUTTON });
    }

    orderHideMiniMenuButton() {
        this.orderChild.emit({ request: SysConf.HIDE_MINI_MENU_BUTTON });
    }

    clickEvent(event) {
        this.orderChild.emit(event);
    }

}
