import { Action } from '@ngrx/store';
import * as Interface from '../../Interface';

const INSERT_NEW = '[ITEM]insertNew';
const ADD = '[ITEM]add';
const MODIFY = '[ITEM]modify';
const REMOVE = '[ITEM]remove';
const REMOVE_ALL = '[ITEM]removeAll';
const REMOVE_BY_SUBJECT_ID = '[ITEM]removeBySubjectId';

export class InsertNewAct implements Action {
  type = INSERT_NEW;
  constructor(public payload: Interface.IItem[]) {}
}

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
  constructor(public payload: Interface.IItem) {}
}

export class RemoveAllAct implements Action {
  type = REMOVE_ALL;
}

export class RemoveBySubjectIdAct implements Action {
  type = REMOVE_BY_SUBJECT_ID;
  constructor(public payload: string) {}
}

const init: Interface.IItem[] = [];

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
        return value._id !== action.payload._id;
      });

    case REMOVE_ALL:
      return [];

    case REMOVE_BY_SUBJECT_ID:
      return state.filter(value => {
        return value.subject_id !== action.payload;
      });

    default:
      return state;
  }
}
