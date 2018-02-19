import { Action } from '@ngrx/store';
import { IUiState } from '../../Interface';

const ADD_MINIMENU = '[UI]add_minimenu';
const MODIFY_MINIMENU = '[UI]modify_minimenu';
const REMOVE_MINIMENU = '[UI]remove_minimenu';
const REMOVE_ALL_MINIMENU = '[UI]remove_all_minimenu';
const CLOSE_MINIMENU = '[UI]close_minimenu';
const CLOSE_ALL_MINIMENU = '[UI]closeAll_minimenu';
const CLOSE_ALL_MINIMENU_WITHOUT_ONE = '[UI]closeAllWithOutOne_minimenu';

export class AddMiniMenuAct implements Action {
  type = ADD_MINIMENU;
  constructor(public payload: IUiState) {}
}

export class ModifyMiniMenuAct implements Action {
  type = MODIFY_MINIMENU;
  constructor(public payload: IUiState) {}
}

export class RemoveMiniMenuAct implements Action {
  type = REMOVE_MINIMENU;
  constructor(public payload: IUiState) {}
}

export class RemoveAllMiniMenuAct implements Action {
  type = REMOVE_ALL_MINIMENU;
}

export class CloseMiniMenu implements Action {
  type = CLOSE_MINIMENU;
  constructor(public payload: IUiState) {}
}

export class CloseAllMiniMenu implements Action {
  type = CLOSE_ALL_MINIMENU;
}

export class CloseAllMiniMenuWithOutOneAct implements Action {
  type = CLOSE_ALL_MINIMENU_WITHOUT_ONE;
  constructor(public payload: IUiState) {}
}

const init: IUiState[] = [];

export function Reducer(state = init, action) {
  // console.log(`MINIMENU REDUX TEST: ${ state }`);
  switch (action.type) {
    case ADD_MINIMENU:
      return [...state, ...action.payload];

    case MODIFY_MINIMENU:
      return state.map(value => {
        if (value.id === action.payload.id) {
          return Object.assign({}, value, { state: action.payload.state });
        } else {
          return value;
        }
      });

    case REMOVE_MINIMENU:
      return state.filter(value => {
        return value.id !== action.payload.id;
      });

    case REMOVE_ALL_MINIMENU:
      return [];

    case CLOSE_MINIMENU:
      // console.log(JSON.stringify(state));
      if (state.length < 1) {
        return state;
      }
      return state.map(value => {
        return value.id === action.payload.id ?
                Object.assign({}, value, { state: { menuHidden: true } }) : value;
      });

    case CLOSE_ALL_MINIMENU:
      return state.map(value => {
        return Object.assign({}, value, { state: { menuHidden: true } });
      });

    case CLOSE_ALL_MINIMENU_WITHOUT_ONE:
      return state.map(value => {
        return value.id !== action.payload.id ?
                Object.assign({}, value, { state: { menuHidden: true } }) :
                Object.assign({}, action.payload, { state: { menuHidden: false } });
      });

    default:
      return state;
  }
}
