import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const ADD = '[FAST]add';
const MODIFY = '[FAST]modify';
const REMOVE = '[FAST]remove';

export class AddAct implements Action {
  type = ADD;
  constructor(public payload: Interface.IItem[]) {}
}

export class ModifyAct implements Action {
  type = MODIFY;
  constructor(public payload: Interface.IItem) {}
}

export class RemoveAct implements Action {
  type = REMOVE;
  constructor(public payload: Interface.IItem[]) {}
}

const init: Interface.IItem[] = [];

export function Reducer(state = init, action) {
  switch (action.type) {
    case ADD:
      return [...state, ...action.payload];

    case MODIFY:
      return Object.assign({}, state, action.payload);

    case REMOVE:
      if (action.payload.length === 0) {
        return [];
      } else {
        return state.filter(item => {
          let count = 0;
          for (let i = 0; i < action.payload.length; i++) {
            if (item._id === action.payload[i]._id) {
              count = count + 1;
            }
          }
          return count === 0 ? true : false;
        });
      }

    default:
      return state;
  }
}
