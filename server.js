'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Book = require('./models/book');
const mongoose = require('mongoose');
const db = mongoose.connection;
const verifyUser = require('./auth')
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

mongoose.connect(process.env.DB_URL);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
});

app.get('/books', getBooks);
app.post('/books', postBook);
app.delete('/books/:id', deleteBook)
app.put('/books/:id', putBook);

async function getBooks(req, res, next) {
  verifyUser(req, async (err, user)=> {
    if(err){
      console.error(err);
      res.send('invalid token');
    } else{
      try {
        let results = await Book.find({});
        res.status(200).send(results);
      } catch(err) {
        next(err);
      }
    }  
  });
}

async function postBook (req, res, next) {
  try{
    let createdBook = await Book.create(req.body);
    res.status(200).send(createdBook);
  } catch (error){
    next(error);
  }
}

async function deleteBook (req, res, next) {
  try{
    let id = req.params.id;
    await Book.findByIdAndDelete(id);
    res.status(200).send('Book Deleted');
  } catch (error){
    next(error);
  }
}

async function putBook (req, res, next) {
  try{
    let id = req.params.id;
    let updatedBook = req.body;
    let updatedBookFromDB = await Book.findByIdAndUpdate(id, updatedBook, {new: true, overwrite: true});
    res.status(200).send(updatedBookFromDB);
  } catch (error){
    next(error);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});

app.get('/test', (request, response) => {
  response.send('test request received')
})

app.use((error, request, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
