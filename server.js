'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Book = require('./models/book');
const mongoose = require('mongoose');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

mongoose.connect(process.env.DB_URL);

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
});

app.get('/books', getBooks);
async function getBooks(req, res, next) {
  try {
    let results = await Book.find({});
    res.status(200).send(results);
  } catch(err) {
    next(err);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});

app.get('/test', (request, response) => {
  response.send('test request received')
})

app.use((error, request, response, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
