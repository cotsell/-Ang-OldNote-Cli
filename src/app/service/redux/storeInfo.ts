import * as Interface from '../Interface';
import { Reducer as ProjectList } from './reducers/projectListReducer';
import { Reducer as SubjectList } from './reducers/subjectListReducer';
import { Reducer as ItemList } from './reducers/itemListReducer';
import { Reducer as ItemDetail } from './reducers/itemDetailReducer';
import { Reducer as FastList } from './reducers/fastListReducer';
import { Reducer as ComponentUi } from './reducers/componentUiReducer';
import { Reducer as MiniMenu } from './reducers/minimenuUiReducer';

export interface StoreInfo {
  projectList: Interface.IProject[];
  subjectList: Interface.ISubject[];
  itemList: Interface.IItem[];
  fastList: Interface.IItem[];
  itemDetail: Interface.IItem;
  // ui: Interface.IUi;
  componentUi: Interface.IUiState[];
  minimenuUi: Interface.IUiState[];
}

export function getReducers() {
  return  { 
    projectList: ProjectList,
    subjectList: SubjectList,
    itemList: ItemList,
    itemDetail: ItemDetail,
    fastList: FastList,
    // ui: { minimenu: Reducers.minimenuUi.Reducer, component: Reducers.componentUi.Reducer }
    componentUi: ComponentUi,
    minimenuUi: MiniMenu,
  };
}

export function getProjectList(state: StoreInfo): Interface.IProject[] {
  return state.projectList;
}

export function getSubjectList(state: StoreInfo): Interface.ISubject[] {
  return state.subjectList;
}

export function getItemList(state: StoreInfo): Interface.IItem[] {
  return state.itemList;
}

export function getFastList(state: StoreInfo): Interface.IItem[] {
  return state.fastList;
}

export function getItemDetail(state: StoreInfo): Interface.IItem {
  return state.itemDetail;
}

export function getComponentUi(state: StoreInfo): Interface.IUiState[] {
  return state.componentUi;
}

export function getMinimenuUi(state: StoreInfo): Interface.IUiState[] {
  return state.minimenuUi;
}
