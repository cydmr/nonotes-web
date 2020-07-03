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
        this._item = res;
        this.state = 'done';
      });
    } else {
      this._list = new observable.map();
      this.state = 'listing';
      request.get(`/api/categories/${category_id}/notes`).then(notes => {
        notes.forEach(i => this._list.set(i._id, i));
        this.state = 'done';
      });
    }
  }
  add({category_id = null, data}) {
    request.post(`/api/categories/${category_id}/notes`, data).then(note => {
      console.log(note);
      if (note) {
        this._list.set(note._id, note);
      }
    });
  }

  update({category_id = null, note_id, data}) {
    request.put(`/api/categories/${category_id}/notes/${note_id}`, data).then(note => {
      if (note) {
        this._list.set(note._id, note);
      }
    });
  }

  delete({category_id = null, note_id}) {
    request.delete(`/api/categories/${category_id}/notes/${note_id}`).then(res => {
      if (res) {
        this._list.delete(note_id);
      }
    });
  }

  quick({category_id = null, note_id}) {
    return request.post(`/api/categories/${category_id}/notes/${note_id}/quick`, {}).then(note => {
      if (note) {
        this._list.set(note_id, note);
        return note;
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
