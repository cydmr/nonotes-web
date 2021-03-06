const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @route   GET api/auth
// @desc    Authenticate user & Get user
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById({_id: req.user._id}).select('-password');

    console.log('connected');
    res.json({data: user});
  } catch (e) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Login User
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if (!user) {
        res.status(400).json({data: {msg: 'Invalid credentials'}});
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({data: {msg: 'Invalid credentials'}});
      }

      const payload = {
        user: {
          _id: user._id,
        },
      };
      const expires = 6000;
      jwt.sign(
        payload,
        process.env.jwtSecret || config.get('jwtSecret'),
        {expiresIn: expires},
        (err, token) => {
          if (err) throw err;
          console.log({token, expires});
          res.json({data: {token, expires}});
        }
      );
    } catch (e) {
      console.log(e.message);
      res.status(500).send(e);
    }
  }
);

module.exports = router;
