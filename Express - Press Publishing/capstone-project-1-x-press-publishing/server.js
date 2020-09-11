const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const apiRouter = require('./api/api');
const errorhandler = require('errorhandler');
const app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api',apiRouter);
app.use(errorhandler());

app.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT)
});

module.exports = app;
