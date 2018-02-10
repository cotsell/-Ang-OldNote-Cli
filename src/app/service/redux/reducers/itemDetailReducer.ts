import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const ADD = '[ITEMDETAIL]remove';
const MODIFY = '[ITEMDETAIL]modify';
const REMOVE = '[ITEMDETAIL]remove';

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
  constructor(public payload: Interface.IItem[]) {}
}

const init: Interface.IItem = {};

export function Reducer(state = init, action) {
  switch (action.type) {
    case ADD:
      return Object.assign({}, state, action.payload);

    case MODIFY:
      return Object.assign({}, state, action.payload);

    case REMOVE:
      return {};

    default:
      return state;
  }
}
