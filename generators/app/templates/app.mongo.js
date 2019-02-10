const express = require('express');
const config = require('./config');
const enrouten = require('express-enrouten');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

/* eslint-disable no-console */

let mongoUrl = `mongodb://${config.get('MONGODB_HOST')}:${config.get('MONGODB_PORT')}/${config.get('MONGODB_NAME')}`;
if (config.get('MONGODB_USER') && config.get('MONGODB_PASS')) {
  mongoUrl = `mongodb://${config.get('MONGODB_USER')}:${config.get('MONGODB_PASS')}@${config.get('MONGODB_HOST')}:${config.get('MONGODB_PORT')}/${config.get('MONGODB_NAME')}`;
}

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => console.log('mongodb connection succesful'))
  .catch(((err) => {
    if (err.message.code === 'ETIMEDOUT') {
      // Attempting to re-establish database connection
      mongoose.connect(mongoUrl);
    } else {
      // Error while attempting to connect to database
      throw err;
    }
  }));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', (req, res) => {
  res.json({
    success: true
  });
});
app.use('/<%= serviceApiName %>', enrouten({
  directory: path.join(__dirname, 'controllers'),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = config.get('PORT');

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
