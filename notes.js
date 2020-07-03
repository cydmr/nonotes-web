const express = require('express');
const router = express.Router({mergeParams: true});
const {check, validationResult} = require('express-validator');
const Note = require('./models/Note');
const Category = require('./models/Category');
const mongoose = require('mongoose');

// @route   GET api/category/:cat_id/notes
// @desc    Get all notes of a category
// @access  Public
router.get('/', async (req, res) => {
  try {
    // const category = await Category.findById(req.params.cat_id);
    const category = req.category;
    // console.log({id: category.notes._id, name: category.notes.name});

    const notes = await Note.find({_id: {$in: category.notes}}).sort({date: 1});

    // console.log(no_notes);
    // const promises = category.notes.map(id =>
    //   (async () => {
    //     const note = await Note.findById(id);
    //     // console.log(note);
    //     notes.push(note);
    //   })()
    // );
    // await Promise.all(promises);
    // await category.notes.forEach(async id => {
    //   const note = await Note.findById(id);
    //   notes.push(note);
    //   console.log(note);
    // });
    // category.notes;
    res.json(notes);
    // res.json({
    //   category: category.name,
    //   description: category.description,
    //   notes: notes.map(i => i._id),
    // });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/notes/:_id
// @desc    Get note by id
// @access  Public
router.get('/:_id', async (req, res) => {
  try {
    const note = await Note.findById(req.params._id);
    if (!note) {
      return res.status(404).json({msg: 'Note not found'});
    }
    res.json(note);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectID') {
      return res.status(404).json({msg: 'Note not found'});
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/categories/:cat_id/notes
// @desc    Add/Edit a note
// @access  Public
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('text', 'Text is required ').not().isEmpty(),
    // check('category', 'Category is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {title, text} = req.body;
    try {
      const note = new Note({title, text, category: req.category._id});
      // console.log(note);
      await note.save();

      req.category.notes.push({_id: note._id});
      req.category.save();
      res.send(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/categories/:cat_id/notes/quick-notes
// @desc    Add a note to Quick Notes
// @access  Public
router.post('/:_id/quick', async (req, res) => {
  try {
    const note = await Note.findOne({_id: req.params._id});
    if (!note) {
      return res.status(404).json({msg: 'can not add to Quick Notes'});
    }

    note.isQuick = !note.isQuick;
    await note.save();
    res.send(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notes
// @desc    Edit a note
// @access  Public
router.put('/:_id', async (req, res) => {
  try {
    // const note = await Note.updateOne({ _id: req.params._id }, req.body);
    const note = await Note.findOne({_id: req.params._id});
    if (!note) {
      return res.status(404).json({msg: 'Note not found'});
    } else {
      Object.entries(req.body).map(([key, value]) => key !== '_id' && (note[key] = value));
      const updated = await note.save();
      // const cat = category.notes.map(note => note._id).filter(id => req.params._id)

      res.send(updated);

      // const updated = await Note.findByIdAndUpdate(req.params._id, req.body, { lean: true });
      // const updated = await Note.findOne({ _id: req.params._id });
      // res.send(updated);
      // console.log({ note });
      // const body = req.body;
      // note = { body };
      // console.log({ note });
      // await note.save();
      // res.send(note);
    }
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.status(500).send('Server Error');
  }
});

// router.put('/:_id/quick-note', async (req, res) => {
//   const note = await Note.findOne({_id: req.params._id});
//   if (!note) {
//     return res.status(404).json({msg: 'Note not found'});
//   } else {
//     const isQuick = note.isQuick;
//     isQuick
//       ? // hizli notlardan cikar
//         (note.isQuick = !isQuick)
//       : (note.isQuick = !isQuick);
//     // hizli notlara ekle
//   }
// });

// @route   DELETE /api/categories/:cat_id/notes/:_id
// @desc    Delete a note
// @access  Public
router.delete('/:_id', async (req, res) => {
  try {
    // await Note.findOneAndDelete({_id: req.params._id}, async (error, result) => {
    //   if (error || !result) {
    //     console.log(result);
    //     res.status(500).json({msg: 'Note could not delete'});
    //   } else {
    //     const deleteIndex = req.category.notes.map(i => i._id).indexOf(req.params._id);
    //     if (deleteIndex > -1) req.category.notes.splice(deleteIndex, 1);
    //     await req.category.save();
    //     console.log(result);
    //     res.json({msg: `deleted ${result}`});
    //   }
    // });
    await Note.deleteOne({_id: req.params._id}, async (error, result) => {
      if (error || result.deletedCount === 0) {
        res.status(500).json({msg: 'Note could not delete'});
      } else {
        const deleteIndex = req.category.notes.map(i => i._id).indexOf(req.params._id);
        if (deleteIndex > -1) req.category.notes.splice(deleteIndex, 1);
        await req.category.save();
        res.json({msg: `deleted ${req.params._id}`, count: result.deletedCount});
      }
    });
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Note not found'});
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
