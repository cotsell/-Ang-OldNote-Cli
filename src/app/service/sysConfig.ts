export class SysConf {
  // Server URLs
  static JWT_TOKEN_CHECK_ADDRESS = 'http://localhost:8000/account/check';
  static GOOGLE_LOGIN_ADDRESS = 'http://localhost:8000/account/login/google';
  static GOOGLE_SIGN_ADDRESS = 'http://localhost:8000/account/sign/google';
  static DIRECT_LOGIN_ADDRESS = 'http://localhost:8000/account/login/direct';
  static DIRECT_SIGN_ADDRESS = 'http://localhost:8000/account/sign/direct';

  // Client URLs
  static BASIC_ADDRESS = 'http://localhost:4200';
  static MAIN_APP = '/projects';

}
