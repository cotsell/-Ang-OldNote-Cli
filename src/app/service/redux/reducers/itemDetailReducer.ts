import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const CANCEL = '[ITEMDETAIL]cancel';
const ADD = '[ITEMDETAIL]add';
const MODIFY = '[ITEMDETAIL]modify';
const REMOVE = '[ITEMDETAIL]remove';
const ADD_TAG = '[ITEMDETAIL]addTag';
const NEW_CHECKBOX_ITEM = '[ITEMDETAIL]newCheckBoxItem';
const MODIFY_CHECKBOX_ITEM = '[ITEMDETAIL]modifyCheckBoxItem';
const REMOVE_CHECKBOX_ITEM = '[ITEMDETAIL]removeCheckBoxItem';

export class CancelAct implements Action {
  type = CANCEL;
}

export class AddAct implements Action {
  type = ADD;
  constructor(public payload: Interface.IItem) {}
}

export class ModifyAct implements Action {
  type = MODIFY;
  constructor(public payload: Interface.IItem) {}
}

export class RemoveAct implements Action {
  type = REMOVE;
}

export class NewCheckBoxItem implements Action {
  type =  NEW_CHECKBOX_ITEM;
  constructor(public payload) {}
}

export class ModifyCheckBoxItem implements Action {
  type = MODIFY_CHECKBOX_ITEM;
  constructor(public payload) {}
}

export class RemoveCheckBoxItem implements Action {
  type = REMOVE_CHECKBOX_ITEM;
  constructor(public payload) {}
}

const init: Interface.IItem = {};

export function Reducer(state = init, action) {
  let list = {};
  let checkbox_list = {};

  switch (action.type) {
    case CANCEL:
      return JSON.parse(JSON.stringify(state));

    case ADD:
      return Object.assign({}, state, action.payload);

    case MODIFY:
      return Object.assign({}, state, action.payload);

    case REMOVE:
      return {};

    case NEW_CHECKBOX_ITEM:
      list = { list: [...state.checkbox_list.list, ...action.payload] };
      checkbox_list = { checkbox_list: Object.assign({}, state.checkbox_list, list) };
      return Object.assign({}, state, checkbox_list);

    case MODIFY_CHECKBOX_ITEM:
      list = { list: state.checkbox_list.list.map(value => {
        return value.id === action.payload.id ? action.payload : value;
      }) };
      checkbox_list = { checkbox_list: Object.assign({}, state.checkbox_list, list) };
      return Object.assign({}, state, checkbox_list);

    case REMOVE_CHECKBOX_ITEM:
      list = { list: state.checkbox_list.list.filter(value => {
        return value.id !== action.payload.id;
      }) };
      checkbox_list = { checkbox_list: Object.assign({}, state.checkbox_list, list) };
      return Object.assign({}, state, checkbox_list);

    default:
      return state;
  }
}
