const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/register
// @desc    Create user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6}),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if (user) {
        res.status(400).json({errors: [{msg: 'User already exists'}]});
      }

      user = new User({name, email, password});
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.status(200).json({data: {msg: 'SUCCESS'}});
    } catch (e) {
      console.log(e.message);
      res.status(500).send(e);
    }
  }
);

module.exports = router;