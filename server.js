const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const Category = require('./models/Category');

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
  require('./notes')
);
app.use('/api/categories', require('./category'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});

connectDB();
