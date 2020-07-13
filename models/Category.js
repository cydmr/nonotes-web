const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  // notes: [
  //   {
  //     _id: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'note',
  //     },
  //     name: {
  //       type: String,
  //     },
  //   },
  // ],

  date: {type: Date, default: Date.now},
});

module.exports = Category = mongoose.model('category', CategorySchema);
