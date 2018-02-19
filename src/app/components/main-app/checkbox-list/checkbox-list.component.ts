import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { ICheckboxList } from '../../../service/Interface';
import { StoreInfo } from '../../../service/redux/storeInfo';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit {
  @Input() checkboxList: ICheckboxList;

  constructor(private store: Store<StoreInfo>) { }

  ngOnInit() {
  }

}
