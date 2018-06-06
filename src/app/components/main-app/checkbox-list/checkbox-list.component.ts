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

import { ICheckboxList } from '../../../service/Interface';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() newItemFunc;     // 필수. 네트워크 처리 함수를 넣어주세요.
  @Input() modifyItemFunc;  // 필수. 네트워크 처리 함수를 넣어주세요.
  @Input() removeItemFunc;  // 필수. 네트워크 처리 함수를 넣어주세요.

  @Input()
  set checkboxList(value: ICheckboxList) {
    this._checkboxList = Object.assign({}, value);
  }
  get checkboxList() {
    return this._checkboxList;
  }

  _checkboxList: ICheckboxList;

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  newCheckBox(event) {
    this.newItemFunc(event);
  }

  modifyCheckBox(event) {
    this.modifyItemFunc(event);
  }

  removeCheckBox(event) {
    this.removeItemFunc(event);
  }

  ngOnDestroy() {}

}
