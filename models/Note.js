const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
  isQuick: {
    type: Boolean,
    required: true,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'category',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  date: {type: Date, default: Date.now},
});

module.exports = Note = mongoose.model('note', NoteSchema);
