interface TokenObject {
  username: string;
  token: string;
  is_admin: boolean;
  tokenExpiration: number;
}

export class User {
  private static _user: User;
  private _token: string;
  private _tokenExpiration: number;
  private _tokenLiveTime: number;
  private _tokenKey: string = "sanctumToken";
  private _is_admin = false;
  private _username = "";

  private constructor(token: string, tokenExpirationInHours: number) {
    this._token = token;
    this._tokenExpiration = new Date().getTime();
    this._tokenLiveTime = tokenExpirationInHours * 3600000;
  }

  static getInstance() {
    if (!User._user) {
      User._user = new User("", 0.5);
    }

    return User._user;
  }

  get isLoggedIn() {
    const token = User._user.token;

    if (new Date().getTime() > User._user._tokenExpiration) {
      return false;
    }

    return token.length > 0;
  }

  get is_admin() {
    if (!User._user._is_admin) {
      const tokenJson = localStorage.getItem(User._user._tokenKey);

      let tokenObject: Partial<TokenObject> = {};

      if (tokenJson) {
        tokenObject = JSON.parse(tokenJson);
      }

      if (tokenObject?.token && tokenObject.tokenExpiration) {
        User._user._token = tokenObject.token;
        User._user._is_admin = tokenObject?.is_admin ?? false;
        User._user._username = tokenObject?.username ?? "";
        User._user._tokenExpiration = tokenObject.tokenExpiration;
      } else {
        localStorage.removeItem(User._user._tokenKey);
        return "";
      }
    }

    return User._user._is_admin;
  }

  get token() {
    if (!User._user._is_admin) {
      const tokenJson = localStorage.getItem(User._user._tokenKey);

      let tokenObject: Partial<TokenObject> = {};

      if (tokenJson) {
        tokenObject = JSON.parse(tokenJson);
      }

      if (tokenObject?.token && tokenObject.tokenExpiration) {
        User._user._token = tokenObject.token;
        User._user._is_admin = tokenObject?.is_admin ?? false;
        User._user._username = tokenObject?.username ?? "";
        User._user._tokenExpiration = tokenObject.tokenExpiration;
      } else {
        localStorage.removeItem(User._user._tokenKey);
        return "";
      }
    }

    return User._user._token;
  }

  get username() {
    if (!User._user._username) {
      const tokenJson = localStorage.getItem(User._user._tokenKey);

      let tokenObject: Partial<TokenObject> = {};

      if (tokenJson) {
        tokenObject = JSON.parse(tokenJson);
      }

      if (tokenObject?.token && tokenObject.tokenExpiration) {
        User._user._token = tokenObject.token;
        User._user._is_admin = tokenObject?.is_admin ?? false;
        User._user._username = tokenObject?.username ?? "";
        User._user._tokenExpiration = tokenObject.tokenExpiration;
      } else {
        localStorage.removeItem(User._user._tokenKey);
        return "";
      }
    }

    return User._user._username;
  }

  set userinfo(payload: {
    username: string;
    token: string;
    is_admin: boolean;
  }) {
    User._user._token = payload.token;
    User._user._username = payload.username;
    User._user._is_admin = payload.is_admin;
    User._user._tokenExpiration =
      new Date().getTime() + User._user._tokenLiveTime;

    const tokenObject: TokenObject = {
      username: User._user._username,
      token: User._user._token,
      is_admin: User._user._is_admin,
      tokenExpiration: User._user._tokenExpiration,
    };

    localStorage.setItem(User._user._tokenKey, JSON.stringify(tokenObject));
  }

  logout() {
    localStorage.removeItem(User._user._tokenKey);
    User._user._token = "";
    User._user._is_admin = false;
    window.location.reload();
  }
}
