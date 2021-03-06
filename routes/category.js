const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Category = require('../models/Category');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({user: req.user}).sort({date: -1});
    res.json({data: categories});
  } catch (error) {
    console.log(e.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/categories/quick
// @desc    Get quicknotes
// @access  Private
router.get('/quick', auth, async (req, res) => {
  try {
    const quickNotes = await Note.find({isQuick: true, user: req.user});
    res.send({data: quickNotes});
  } catch (error) {
    console.log(error.message);

    res.status(500).send('Server Error');
  }
});

// @route   GET /api/categories/:cat_id
// @desc    Get all categories
// @access  Private
router.get('/:cat_id', auth, async (req, res) => {
  try {
    const category = await Category.find({_id: req.params.cat_id, user: req.user});
    res.json({data: category[0]});
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Add a category
// @access  Private
router.post('/', auth, [check('name', 'Name is required').not().isEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const {name, description} = req.body;
  // console.log(req.user);
  try {
    const category = new Category({name, description, user: req.user});

    await category.save();
    res.send({data: category});
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/categories/:cat_id
// @desc    Edit a category
// @access  Private
router.put('/:cat_id', auth, async (req, res) => {
  try {
    // const note = await Note.updateOne({ _id: req.params._id }, req.body);
    const category = await Category.findOne({_id: req.params.cat_id});
    if (!category) res.status(404).json({msg: 'Category not found'});
    else {
      Object.entries(req.body).map(([key, value]) => key !== '_id' && (category[key] = value));
      const updated = await category.save();
      // const cat = category.notes.map(note => note._id).filter(id => req.params._id)

      res.send({data: updated});
    }
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Category not found'});
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/categories/:cat_id
// @desc    Delete a category
// @access  Private
router.delete('/:cat_id', auth, async (req, res) => {
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
    const category = await Category.findById({_id: req.params.cat_id});
    if (category) {
      await Category.deleteOne({_id: req.params.cat_id});
      await Note.deleteMany({category: req.params.cat_id});
      res.status(200).json({data: {msg: 'Deleted'}});
    } else {
      res.status(500).json({msg: 'Category could not delete'});
    }
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Note not found'});
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
