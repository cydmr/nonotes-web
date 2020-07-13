const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const Category = require('./models/Category');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({extended: true}));
// app.get('/', (req, res) => {
//   res.send('API running');
// });

app.use(
  '/api/categories/:cat_id/notes',
  async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.cat_id);
      if (!category) {
        return res.status(404).json({msg: 'Category not found'});
      }
      req.category = category;
      next();
    } catch (error) {
      console.log(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({msg: 'Category not found'});
      }
      res.status(500).send('Server Error');
    }
  },
  require('./routes/notes')
);
app.use('/api/categories', require('./routes/category'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/register', require('./routes/users'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

connectDB();
