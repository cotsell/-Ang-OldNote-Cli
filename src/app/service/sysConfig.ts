export class SysConf {
  // Server URLs
  // static LOCAL_HOST = '192.168.219.103';
  static LOCAL_HOST = 'localhost';
  static ADDRESS_BASIC = 'http://' + SysConf.LOCAL_HOST + ':8000';
  static JWT_TOKEN_CHECK_ADDRESS = SysConf.ADDRESS_BASIC + '/account/check';
  static GOOGLE_LOGIN_ADDRESS = SysConf.ADDRESS_BASIC + '/account/login/google';
  static GOOGLE_SIGN_ADDRESS = SysConf.ADDRESS_BASIC + '/account/sign/google';
  static DIRECT_LOGIN_ADDRESS = SysConf.ADDRESS_BASIC + '/account/login/direct';
  static DIRECT_SIGN_ADDRESS = SysConf.ADDRESS_BASIC + '/account/sign/direct';

  static GET_PROJECT_LIST = SysConf.ADDRESS_BASIC + '/get/project_list';
  static GET_PROJECT = SysConf.ADDRESS_BASIC + '/get/project';
  static GET_SUBJECT_LIST = SysConf.ADDRESS_BASIC + '/get/subject_list';
  static GET_ITEM = SysConf.ADDRESS_BASIC + '/get/item';
  static GET_TAGS = SysConf.ADDRESS_BASIC + '/get/tags';
  static GET_FAST = SysConf.ADDRESS_BASIC + '/get/fast';

  static UPDATE_PROJECT = SysConf.ADDRESS_BASIC + '/update/project';
  static UPDATE_SUBJECT = SysConf.ADDRESS_BASIC + '/update/subject';
  static UPDATE_ITEM = SysConf.ADDRESS_BASIC + '/update/item';

  static INSERT_PROJECT = SysConf.ADDRESS_BASIC + '/insert/project';
  static INSERT_SUBJECT = SysConf.ADDRESS_BASIC + '/insert/subject';
  static INSERT_ITEM = SysConf.ADDRESS_BASIC + '/insert/item';
  static INSERT_FAST = SysConf.ADDRESS_BASIC + '/insert/fast';

  static DELETE_PROJECT = SysConf.ADDRESS_BASIC + '/delete/project';
  static DELETE_SUBJECT = SysConf.ADDRESS_BASIC + '/delete/subject';
  static DELETE_ITEM = SysConf.ADDRESS_BASIC + '/delete/item';
  static DELETE_FAST = SysConf.ADDRESS_BASIC + '/delete/fast';

  // Client URLs
  static BASIC_ADDRESS = 'http://' + SysConf.LOCAL_HOST + ':8001';
  static MAIN_APP = '/projects';

  // @Output request commands.
  static GET_PROJECT_LIST_FROM_SERVER = 'getProjectList';
  static GET_SUBJECT_LIST_FROM_SERVER = 'getSubjectList';
  static GET_FAST_LIST_FROM_SERVER = 'getFastList';

  // @Input request commands.
  static CLOSE_LAYER = 'closeLayer';
  static CLICK_EVENT = 'clickEvent';
  static SHOW_MINI_MENU_BUTTON = 'showMiniMenuButton';
  static HIDE_MINI_MENU_BUTTON = 'hideMiniMenuButton';

  // ICON
  // Arrow by Numero Uno from the Noun Project
  // menu by Numero Uno from the Noun Project

}
