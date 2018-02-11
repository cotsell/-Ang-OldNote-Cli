import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const INSERT_NEW = '[PROJECT]insertNew';
const ADD = '[PROJECT]add';
const MODIFY = '[PROJECT]modify';
const REMOVE = '[PROJECT]remove';

export class InsertNew implements Action {
  type = INSERT_NEW;
  constructor(public payload: Interface.IProject[]) {}
}

export class AddAct implements Action {
  type = ADD;
  constructor(public payload: Interface.IProject) {}
}

export class ModifyAct implements Action {
  type = MODIFY;
  constructor(public payload: Interface.IProject) {}
}

export class RemoveAct implements Action {
  type = REMOVE;
  constructor(public payload: Interface.IProject[]) {}
}

const init: Interface.IProject[] = [];

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
      break;

    default:
      return state;
  }
}
