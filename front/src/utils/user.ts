interface TokenObject {
  token?: string;
  tokenExpiration?: number;
}

export class User {
  private static _user: User;
  private _token: string;
  private _tokenExpiration: number;
  private _tokenLiveTime: number;
  private _tokenKey: string = "sanctumToken";

  private constructor(token: string, tokenExpirationInHours: number) {
    debugger;
    this._token = token;
    this._tokenExpiration = new Date().getTime();
    this._tokenLiveTime = tokenExpirationInHours * 3600000;
  }

  static getInstance() {
    debugger;
    if (!User._user) {
      User._user = new User("", 0.5);
    }

    return User._user;
  }

  get isLoggedIn() {
    debugger;
    const token = User._user.token;

    if (new Date().getTime() > User._user._tokenExpiration) {
      return false;
    }

    return token.length > 0;
  }

  get token() {
    debugger;
    if (!User._user._token) {
      const tokenJson = localStorage.getItem(User._user._tokenKey);

      let tokenObject: TokenObject = {};

      if (tokenJson) {
        tokenObject = JSON.parse(tokenJson);
      }

      if (tokenObject?.token && tokenObject.tokenExpiration) {
        User._user._token = User._user._token = tokenObject.token;
        User._user._tokenExpiration = tokenObject.tokenExpiration;
      } else {
        localStorage.removeItem(User._user._tokenKey);
        return "";
      }
    }

    return User._user._token;
  }

  set token(token: string) {
    debugger;
    User._user._token = token;
    User._user._tokenExpiration =
      new Date().getTime() + User._user._tokenLiveTime;
    const tokenObject: TokenObject = {
      token: User._user._token,
      tokenExpiration: User._user._tokenExpiration,
    };

    localStorage.setItem(User._user._tokenKey, JSON.stringify(tokenObject));
  }

  logout() {
    debugger;
    localStorage.removeItem(User._user._tokenKey);
    User._user._token = "";
    window.location.reload();
  }
}
