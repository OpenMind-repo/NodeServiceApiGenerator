const config = require('./config');
const path = require('path');
const express = require('express');
const enrouten = require('express-enrouten');

/* eslint-disable no-console */

const app = express();

app.use('/<%= serviceApiName %>', enrouten({
  directory: path.join(__dirname, 'controllers'),
}));


const port = config.get('PORT');

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
