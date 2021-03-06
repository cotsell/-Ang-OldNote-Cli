import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const INSERT_NEW = '[SUBJECT]insertNew';
const ADD = '[SUBJECT]add';
const MODIFY = '[SUBJECT]modify';
const REMOVE = '[SUBJECT]remove';
const REMOVE_ALL = '[SUBJECT]removeAll';

export class InsertNewAct implements Action {
  type = INSERT_NEW;
  constructor(public payload: Interface.ISubject[]) {}
}

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

export class RemoveAllAct implements Action {
  type = REMOVE_ALL;
}

const init: Interface.ISubject[] = [];

export function Reducer(state = init, action) {
  switch (action.type) {
    case INSERT_NEW:
      return [...action.payload];

    case ADD:
      return [...state, ...action.payload];

    case MODIFY:
      return state.map(value => {
        return value._id === action.payload._id ? action.payload : value;
      });

    case REMOVE:
      return state.filter(value => {
        let count = 0;
        for (let i = 0; i < action.payload.length; i++) {
          if (value._id === action.payload[i]._id) {
            count = count + 1;
          }
        }
        return count > 0 ? false : true;
      });

    case REMOVE_ALL:
      return [];

    default:
      return state;
  }
}
