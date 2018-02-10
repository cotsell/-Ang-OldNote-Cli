import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const ADD = '[PROJECT]remove';
const MODIFY = '[PROJECT]modify';
const REMOVE = '[PROJECT]remove';

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
    case ADD:
      return [...state, action.payload];

    case MODIFY:
      break;

    case REMOVE:
      break;

    default:
      return state;
  }
}
