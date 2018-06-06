import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import { NetworkService } from '../../../service/network.service';
import { SysConf } from '../../../service/sysConfig';
import { uuid } from '../../../service/utils';
import { IOutputMsg, IOrderMsg, IUiState } from '../../../service/Interface';
import { StoreInfo, getMinimenuUi } from '../../../service/redux/storeInfo';
import * as MiniMenuAct from '../../../service/redux/reducers/minimenuUiReducer';

export interface What {
  request: string;
  object: any;
}

export interface UiState {
  menuHidden: boolean;
}

@Component({
  selector: 'app-minimenu',
  templateUrl: './minimenu.component.html',
  styleUrls: ['./minimenu.component.scss']
})
export class MinimenuComponent implements OnInit, OnDestroy {
    @Input() pcMode = true; // 모바일 모드일때는 false 입력 필수.
    isMinimenuHidden:       boolean;

    @Input() object:                What;
    @Input() order:                 EventEmitter<IOrderMsg>;
    minimenuUiSubscription: Subscription;
    orderSubscription:      Subscription;
    uiState:                IUiState;

    @ViewChild('menu_layer')    menuLayer:  ElementRef;
    @ViewChild('menu_button')   menuButton: ElementRef;



    constructor(
        private network: NetworkService,
        private store: Store<StoreInfo>) {}

    ngOnInit() {
        this.settingMiniMenu(); // pcMode 상태에 따른 미니메뉴 숨김 초기화.

        // 리덕스에 새로운 MiniMenu를 넣어줘요.
        this.uiState = { id: uuid(), state: { menuHidden: true }};
        this.store.dispatch(new MiniMenuAct.AddMiniMenuAct(this.uiState));

        // 리덕스에서 minimenu를 구독합니다.
        this.minimenuUiSubscription = this.store.select(getMinimenuUi)
            .subscribe(obs => {
                this.uiState = obs.find(value => value.id === this.uiState.id);
            });


        // 부모로부터 받을 명령을 구독합니다.
        this.orderSubscription = this.order.subscribe(obs => {
            // console.log(obs);
            switch (obs.request) {
                case SysConf.CLICK_EVENT :
                    // TODO 삭제예정. 이 조건식은 stopPropagation()을 사용하면 필요 없어짐.
                    // if (obs.object.target.id !== 'minimenu_main_div' &&
                    //     obs.object.target.id !== 'hide_menu') {
                        console.log(`전체 클릭 이벤트 발생.`);
                        this.closeMenuLayer();
                    // }
                    break;

                case SysConf.SHOW_MINI_MENU_BUTTON :
                    // this.menuButton.nativeElement.hidden = false;
                    this.changeMinimenuHidden(false);
                    break;

                case SysConf.HIDE_MINI_MENU_BUTTON :
                    // this.menuButton.nativeElement.hidden = true;
                    this.changeMinimenuHidden(true);
                    break;
            }
        });
    }

    controlLayer(event, target) {
        event.stopPropagation(); // 이벤트 버블링을 방지해줘요.
        // target.hidden = !target.hidden;
        this.store.dispatch(new MiniMenuAct.ModifyMiniMenuAct(
            Object.assign(
                {},
                this.uiState,
                { state: {  menuHidden: !this.uiState.state.menuHidden } }))
        );
    }

    // 낭비인건 알지만, @ViewChild()를 써보기 위해서 따로 만들어봤어요.
    closeMenuLayer() {
        // console.log(`minimenu.components.ts: closeMenuLayer(): 레이어를 닫을래요.`);
        // this.menuLayer.nativeElement.hidden = true;
        this.store.dispatch(new MiniMenuAct.CloseMiniMenu(this.uiState));
    }

    settingMiniMenu() {
        this.isMinimenuHidden = false;
        if (this.pcMode === true) {
            this.isMinimenuHidden = true;
        }
    }

    changeMinimenuHidden(state: boolean) {
        if (this.pcMode === true) {
            this.isMinimenuHidden = state;
        }
    }

    ngOnDestroy() {
        this.store.dispatch(new MiniMenuAct.RemoveMiniMenuAct(this.uiState));
        if (this.minimenuUiSubscription !== undefined) {
            this.minimenuUiSubscription.unsubscribe();
        }
        if (this.orderSubscription !== undefined) {
            this.orderSubscription.unsubscribe();
        }
    }
}
