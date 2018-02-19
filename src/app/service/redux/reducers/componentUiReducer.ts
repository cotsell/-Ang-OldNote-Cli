import { Action } from '@ngrx/store';
import { IUiState } from '../../Interface';

const ADD_COMPONENT = '[UI]add_component';
const MODIFY_COMPONENT = '[UI]modify_component';
const REMOVE_COMPONENT = '[UI]remove_component';

export class AddComponentAct implements Action {
  type = ADD_COMPONENT;
  constructor(public payload: IUiState) {}
}

export class ModifyComponentAct implements Action {
  type = MODIFY_COMPONENT;
  constructor(public payload: IUiState) {}
}

export class RemoveComponentAct implements Action {
  type = REMOVE_COMPONENT;
  constructor(public payload: IUiState) {}
}

const init: IUiState[] = [];

export function Reducer(state = init, action) {
  switch (action.type) {
    case ADD_COMPONENT:
      return [...state, ...action.payload];

    case MODIFY_COMPONENT:
      return state.map(value => {
        if (value.id === action.payload.id) {
          return Object.assign({}, value, { state: action.payload.state });
        } else {
          return value;
        }
      });

    case REMOVE_COMPONENT:
    return state.filter(value => {
      return value.id !== action.payload.id;
    });

    default:
      return state;
  }
}
