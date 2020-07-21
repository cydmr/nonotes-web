import {observable, action, computed, decorate, extendObservable, toJS} from 'mobx';
import {request} from 'helpers/request';
import {useParams, useHistory} from 'react-router-dom';
import React from 'react';
import {act} from 'react-dom/test-utils';

export default class notesStore {
  _list = new observable.map();
  _item = {};
  state = 'listing';

  constructer(Stores) {
    this.stores = Stores;
  }

  read({_id = null, category_id = null}) {
    if (_id) {
      this.state = 'getting';
      request.get(`/api/categories/${category_id}/notes/${_id}/`).then(res => {
        if (!res.data) return;
        console.log({get: res.data});
        this._item = res.data;
        this.state = 'done';
      });
    } else {
      this._list = new observable.map();
      this.state = 'listing';
      request.get(`/api/categories/${category_id}/notes`).then(res => {
        if (!res.data) return;

        res.data.forEach(i => this._list.set(i._id, i));
        this.state = 'done';
      });
    }
  }
  add({category_id = null, data}) {
    request.post(`/api/categories/${category_id}/notes`, data).then(res => {
      if (res.data) {
        this._list.set(res.data._id, res.data);
      }
    });
  }

  update({category_id = null, note_id, data}) {
    request.put(`/api/categories/${category_id}/notes/${note_id}`, data).then(res => {
      if (res.data) {
        this._list.set(res.data._id, res.data);
      }
    });
  }

  delete({category_id = null, note_id}) {
    request.delete(`/api/categories/${category_id}/notes/${note_id}`).then(res => {
      if (res.data) {
        this._list.delete(note_id);
      }
    });
  }

  quick({category_id = null, note_id}) {
    return request.post(`/api/categories/${category_id}/notes/${note_id}/quick`, {}).then(res => {
      if (res.data) {
        this._list.set(note_id, res.data);
        return res.data;
        // note.isQuick
        //   ? this.stores.quickNotesStore.add(note)
        //   : this.stores.quickNotesStore.delete(note);
      }
    });
  }

  get list() {
    return [...this._list.values()];
  }
  get item() {
    return toJS(this._item);
  }
}

decorate(notesStore, {
  _list: observable,
  list: computed,
  _item: observable,
  item: computed,
  state: observable,
  read: action,
  add: action,
  update: action,
  delete: action,
  quick: action,
});
