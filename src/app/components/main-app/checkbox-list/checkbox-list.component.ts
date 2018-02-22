// checkbox-list Component와 checkbox Component는 다른 컴포넌트들과는 주입성을 주입하지 않기 위해,
// 리덕스의 checkboxList 항목만을 이용해요.
// 부모 컴포넌트로부터 checkboxList의 id를 받아서 id에 해당하는 checkboxList를 처리해요.

// 이 컴포넌트를 이용하기 위해서는 부모컴포넌트는 리덕스의 checkboxList 항목에
// 리스트를 미리 생성하고, checkbox-list 컴포넌트에 그 checkbox-list의 id를
// checkboxListId에 넣어주세요.

// 변화된 checkboxList에 대한 네트워크 처리는 부모 컴포넌트에서 리덕스의 checkboxList 항목을
// 구독해서 처리해줘요.

import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter,
          SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import { ICheckboxList } from '../../../service/Interface';
import { StoreInfo, getCheckbox } from '../../../service/redux/storeInfo';
import * as CheckBoxListRedux from '../../../service/redux/reducers/checkboxReducer';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() newItemFunc;             // 필. 네트워크 처리 함수를 넣어주세요.
  @Input() modifyItemFunc;          // 필. 네트워크 처리 함수를 넣어주세요.
  @Input() removeItemFunc;          // 필. 네트워크 처리 함수를 넣어주세요.

  @Input() checkboxListId;

  subscription: Subscription;
  checkboxList: ICheckboxList;

  constructor(private store: Store<StoreInfo>) {
    // 리덕스 구독.
    this.subscription = this.store.select(getCheckbox)
      .subscribe(obs => {
        this.checkboxList = obs.find(item => {
          return item.id === this.checkboxListId;
        });
      });
   }

  ngOnInit() {
    // console.log(`checkbox-list ngOnInit()`);
    // setTimeout(() => { console.log(JSON.stringify(this.checkboxList)); }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(`checkbox-list ngOnChanges`);
    // console.log(changes);

    // checkboxListId의 값이 바뀔 때마다 기존의 구독을 해지하고, 다시 구독을 신청해요.
    if (changes.checkboxListId.firstChange !== true &&
        changes.checkboxListId.currentValue !== null &&
        changes.checkboxListId.currentValue !== undefined) {
      this.unSubscribe(this.subscription); // 혹시나 이전에 구독하고 있는게 있을 수 있으니까..
      if (this.checkboxListId !== undefined && this.checkboxListId !== null) {
        this.subscription = this.store.select(getCheckbox)
        .subscribe(obs => {
          this.checkboxList = obs.find(item => {
            return item.id === this.checkboxListId;
          });
        });
      }
    }
  }

  private newCheckBox(event) {
    // console.log(JSON.stringify(event));
    this.store.dispatch(new CheckBoxListRedux.AddItemAct(this.checkboxListId, event));
  }

  private modifyCheckBox(event) {
    // console.log(event);
    // console.log(this.checkboxList.list);
    this.store.dispatch(new CheckBoxListRedux.ModifyItemAct(this.checkboxListId, event));
  }

  private removeCheckBox(event) {
    console.log(event);
    console.log(this.checkboxList.list);
  }

  outputStateChanged() {

  }

  unSubscribe(scription: Subscription) {
    if (scription !== undefined) {
      scription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unSubscribe(this.subscription);
  }

}
