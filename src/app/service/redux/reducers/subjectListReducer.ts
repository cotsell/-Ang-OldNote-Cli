import { Action } from '@ngrx/store';

const TEST = 'test';

export class TestAction implements Action {
  type = TEST;
}

export function Reducer(state, action) {
  switch (action.type) {
    case TEST:
      break;

    default:
      return state;
  }
}
