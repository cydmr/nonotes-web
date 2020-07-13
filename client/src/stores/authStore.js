import {observable, action, computed, decorate, extendObservable, toJS} from 'mobx';
import {request} from 'helpers/request';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class authStore {
  state = 'listing';
  authenticated = false;
  token = cookies.get('token') || '';

  constructer(Stores) {
    this.stores = Stores;
    // extendObservable(this, {
    //   _list: [],
    //   state: 'listing',
    // });
  }

  handleAuth() {
    this.token = cookies.get('token') || '';
  }

  register(data) {
    request.post('/api/register', data).then(res => {
      if (!res.data) return;
      this.login(data);
    });
  }

  login(data) {
    request.post('/api/auth', data, false).then(res => {
      if (!res.data) return;
      cookies.set('token', res.data.token, {maxAge: res.data.expires});

      this.token = res.data.token;
      this.authenticated = true;
    });
  }

  logout() {
    this.token = '';
    this.authenticated = false;
    cookies.remove('token');
  }

  // get list() {
  //   return [...this._list.values()];
  // }

  // add(note) {
  //   this._list.set(note._id, note);
  // }

  // delete(_id) {
  //   this._list.delete(_id);
  // }
}

decorate(authStore, {
  isAuthenticated: observable,
  state: observable,
  token: observable,
  read: action,
  login: action,
  logout: action,
  register: action,
  handleAuth: action,

  // add: action,
  // delete: action,
});

// export const categoriesStore = observable(
//   {
//     _list: [],
//     state: 'listing',
//     read: () => {
//       this.state = 'done';
//     },
//   },
//   {
//     _list: observable,
//     state: observable,
//     read: action,
//   }
// );
