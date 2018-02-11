import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const ADD = '[SUBJECT]add';
const MODIFY = '[SUBJECT]modify';
const REMOVE = '[SUBJECT]remove';

export class AddAct implements Action {
  type = ADD;
  constructor(public payload: Interface.ISubject) {}
}

export class ModifyAct implements Action {
  type = MODIFY;
  constructor(public payload: Interface.ISubject) {}
}

export class RemoveAct implements Action {
  type = REMOVE;
  constructor(public payload: Interface.ISubject[]) {}
}

const init: Interface.ISubject[] = [];

export function Reducer(state = init, action) {
  switch (action.type) {
    case ADD:
      return [...state, ...action.payload];

    case MODIFY:
      break;

    case REMOVE:
      break;

    default:
      return state;
  }
}
