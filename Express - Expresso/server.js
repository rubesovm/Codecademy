const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const morgan = require('morgan');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const app = express();
const apiRouter = require('./api/api')

PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.use(morgan('dev'))

app.use('/api',apiRouter)

app.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT)
})

module.exports = app;