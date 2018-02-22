import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter, ElementRef,
        OnChanges, SimpleChanges } from '@angular/core';

import { ICheckbox } from '../../../service/Interface';
import { uuid } from '../../../service/utils';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit, OnDestroy, OnChanges {
  @Input() new = false;
  @Output() newCheckBox: EventEmitter<ICheckbox> = new EventEmitter();
  @Output() modifyCheckBox: EventEmitter<ICheckbox> = new EventEmitter();
  @Output() removeCheckBox: EventEmitter<ICheckbox> = new EventEmitter();
  @ViewChild('inputText') inputText: ElementRef;

  @Input()
  set checkbox(value: ICheckbox) {
    this._checkbox = value;
    this.displayCheckbox = Object.assign({}, value);
  }
  get checkbox() {
    return this._checkbox;
  }

  _checkbox: ICheckbox;
  displayCheckbox: ICheckbox;
  isEditText = false;

  constructor() { }

  ngOnInit() {
    // console.log(`checkbox ngOnItit()`);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(`checkbox ngOnChanges`);
    // console.log(changes);
  }

  createNewCheckBox(event) {
    if (event['key'] === 'Enter') {
      const newResult: ICheckbox = {  id: uuid(),
                                      isChecked: false,
                                      text: event.target.value,
                                      sortNumber: 0 };
      this.newCheckBox.emit(newResult);
      event.target.value = '';
    }
  }

  outputModifyCheckBox(event?) {
    this.modifyCheckBox.emit(this.displayCheckbox);
  }

  outputRemoveCheckBox(event?) {
    this.removeCheckBox.emit(this.displayCheckbox);
  }

  changedCheckState(event) {
    // console.log(event);
    event.stopPropagation();
    this.displayCheckbox.isChecked = event.target.checked;
    this.outputModifyCheckBox();
  }

  changedTextState(event) {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.displayCheckbox.text = event.target.value;
      this.outputModifyCheckBox();
    }
  }

  changeIsEditText(event) {
    event.stopPropagation();
    this.isEditText = !this.isEditText;
    if (this.isEditText === false) {
      setTimeout(() => { this.inputText.nativeElement.focus(); }, 0);
    }
  }

  ngOnDestroy() {

  }

}
