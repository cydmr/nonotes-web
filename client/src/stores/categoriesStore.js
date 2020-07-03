import {observable, action, computed, decorate, extendObservable, toJS} from 'mobx';
import {request} from 'helpers/request';

export default class categoriesStore {
  _list = new observable.map();
  state = 'listing';

  constructer(Stores) {
    this.stores = Stores;
    // extendObservable(this, {
    //   _list: [],
    //   state: 'listing',
    // });
  }

  read() {
    this._list = new observable.map();
    request.get(`/api/categories`).then(categories => {
      // console.log(categories);
      console.log(this.state);
      if (!categories) {
        this.state = 'done';
      }
      categories.forEach(i => this._list.set(i._id, i));
      console.log('requesting categories for collapse menu');
      //setAllNotes(categories);
      this.state = 'done';
      console.log(this.state);
    });
  }
  get list() {
    return [...this._list.values()];
  }

  add({data}) {
    return request.post(`/api/categories`, data).then(category => {
      if (category) {
        this._list.set(category._id, category);
      }
      return category;
    });
  }

  update({category_id = null, data}) {
    request.put(`/api/categories/${category_id}`, data).then(category => {
      if (category) {
        this._list.set(category._id, category);
      }
    });
  }

  delete({category_id = null}) {
    return request.delete(`/api/categories/${category_id}`).then(res => {
      if (res) {
        this._list.delete(category_id);
        return res;
      }
    });
  }
}

decorate(categoriesStore, {
  _list: observable,
  list: computed,
  state: observable,
  read: action,
  add: action,
  update: action,
  delete: action,
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
