import categoriesStore from './categoriesStore';
import notesStore from './notesStore';
import quickNotesStore from './quickNotesStore';

class Stores {
  constructor() {
    this.categoriesStore = new categoriesStore(this);
    this.quickNotesStore = new quickNotesStore(this);

    this.notesStore = new notesStore(this);
  }
}

export const stores = new Stores();
