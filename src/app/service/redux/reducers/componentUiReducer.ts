import { Action } from '@ngrx/store';
import { ComponentUi } from '../../Interface';

const ADD = '[COMPONENT_UI]add';
const MODIFY = '[COMPONENT_UI]modify';
const REMOVE = '[COMPONENT_UI]remove';

export class AddAct implements Action {
  type = ADD;
  constructor(public payload: ComponentUi) {}
}

export class ModifyAct implements Action {
  type = MODIFY;
  constructor(public payload: ComponentUi) {}
}

export class RemoveAct implements Action {
  type = REMOVE;
  constructor(public payload: ComponentUi) {}
}

const init: ComponentUi[] = [];

export function Reducer(state = init, action) {
  switch (action.type) {
    case ADD:
      return [...state, ...action.payload];

    case MODIFY:
      return state.map(value => {
        if (value.id === action.payload.id) {
          return Object.assign({}, value, { state: action.payload.state });
        } else {
          return value;
        }
      });

    case REMOVE:
    return state.filter(value => {
      return value.id !== action.payload.id;
    });

    default:
    return state;
  }
}

