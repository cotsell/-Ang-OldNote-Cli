import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const ADD_LIST = '[CHECKBOX_LIST]addList';
const REMOVE_LIST = '[CHECKBOX_LIST]removeList';
const ADD_ITEM = '[CHECKBOX_LIST]addItem';
const MODIFY_ITEM = '[CHECKBOX_LIST]modifyItem';
const REMOVE_ITEM = '[CHECKBOX_LIST]removeItem';

export class AddListAct implements Action {
  type = ADD_LIST;
  constructor(public payload: Interface.ICheckboxList) {}
}

export class RemoveListAct implements Action {
  type = REMOVE_LIST;
  constructor(public payload: Interface.ICheckboxList) {}
}

export class AddItemAct implements Action {
  type = ADD_ITEM;
  constructor(public listId: string, public payload: Interface.ICheckbox) {}
}

export class ModifyItemAct implements Action {
  type = MODIFY_ITEM;
  constructor(public listId: string, public payload: Interface.ICheckbox[]) {}
}

export class RemoveItemAct implements Action {
  type = REMOVE_ITEM;
  constructor(public listId: string, public payload: Interface.ICheckbox[]) {}
}

const init: Interface.ICheckboxList[] = [];

export function Reducer(state = init, action) {
  switch (action.type) {
    case ADD_LIST:
      return [...state, ...action.payload];
      // return Object.assign({}, state, action.payload);

    case REMOVE_LIST:
      return state.filter(value => {
        return value.id !== action.payload.id ? true : false;
      });

    case ADD_ITEM:
      return state.map(list => {
        if (list.id !== action.listId) {
          return list;
        } else {
          return Object.assign({}, list, { list: [...list.list, ...action.payload] });
        }
      });
      // return Object.assign({}, state, { list: [...state.list, ...action.payload] });

    case MODIFY_ITEM:
      return state.map(list => {
        if (list.id !== action.listId) {
          return list;
        } else {
          return Object.assign({}, list, { list: [...list.list.map(value => {
            return value.id === action.payload.id ?
                    Object.assign({}, action.payload) :
                    value;
          })] });
        }
      });
      // return Object.assign({}, state, { list: action.payload });

    // 삭제할 때 이걸 사용하지 않고, remove_item_fast에 빈 배열을 넣어서 사용해도 되요.
    case REMOVE_ITEM:
      if (action.payload.length === 0) {
        return state;
      } else {
        return state.map(list => {
          if (list.id !== action.listId) {
            return list;
          } else {
            return Object.assign({}, list, { list: [...list.list.filter(value => {
              return value.id !== action.payload.id ? true : false;
            })] });
          }
        });
        // return state.list.filter(item => {
        //   let count = 0;
        //   for (let i = 0; i < action.payload.length; i++) {
        //     if (item.id === action.payload[i].id) {
        //       count = count + 1;
        //     }
        //   }
        //   return count === 0 ? true : false;
        // });
      }

    default:
      return state;
  }
}
