import {observable, action, computed, decorate, extendObservable, toJS} from 'mobx';
import {request} from 'helpers/request';

export default class quickNotesStore {
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
    request.get(`/api/categories/quick`).then(res => {
      // console.log(categories);
      if (!res.data) return;

      res.data.forEach(i => this._list.set(i._id, i));
      //setAllNotes(categories);
      this.state = 'done';
    });
  }

  get list() {
    return [...this._list.values()];
  }

  // add(note) {
  //   this._list.set(note._id, note);
  // }

  delete(_id) {
    this._list.delete(_id);
  }
}

decorate(quickNotesStore, {
  _list: observable,
  list: computed,
  state: observable,
  read: action,
  // add: action,
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
