const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

app.use(bodyParser.json()); //this parses all request bodies in JSON format

app.use((req, res, next) => {
  morgan('tiny');
  next();
});

app.get('/api/quotes/random',(req,res,next)=> {
  const randomQuote = getRandomElement(quotes);
  const response = {quote: randomQuote}
  res.send(response);
})

app.get('/api/quotes', (req,res,next) => {
  let response = {quotes: quotes};
  const author = req.query.person;
  if (author) {
    const authorQuotes = quotes.filter(qu => qu.person === author);
    response = {quotes: authorQuotes}
  } 
  res.send(response);
})

app.post('/api/quotes', (req,res,next) => {
  if (req.query.quote && req.query.person) {
    const newQuote = {};
    const response = {quote: newQuote}
    newQuote.quote = req.query.quote;
    newQuote.person = req.query.person;
    quotes.push(newQuote);
    res.status(201).send(response);
  } else {
    res.sendStatus(404);
  }
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

