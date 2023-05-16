import { AUTHORIZATION_TOKEN, GROUP_ID, errorMessageCode } from './utils';

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`${errorMessageCode} ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this.headers,
    }).then((res) => this._checkResponse(res));
  }

  addCard(data) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    }).then((res) => this._checkResponse(res));
  }

  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
    }).then((res) => this._checkResponse(res));
  }

  getUserData() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    }).then((res) => this._checkResponse(res));
  }
  changeProfileData(data) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data),
    }).then((res) => this._checkResponse(res));
  }
  changeAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(avatar),
    }).then((res) => this._checkResponse(res));
  }

  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? 'PUT' : 'DELETE';
    return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: method,
      headers: this.headers,
    }).then((res) => this._checkResponse(res));
  }
}

const api = new Api({
  baseUrl: `https://mesto.nomoreparties.co/v1/${GROUP_ID}`,
  headers: {
    authorization: AUTHORIZATION_TOKEN,
    'Content-Type': 'application/json',
  },
});

export default api;
