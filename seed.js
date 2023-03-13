'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const Book = require('./models/book');

async function seed() {

  await Book.create({
    title: 'Quran',
    description: 'Questions under random anonymous nuns',
    status: true,
  });
  console.log('Quran was added');

  await Book.create({
    title: 'Quotations from Chairman Mao Tse-tung',
    description: 'Quotes, thats it',
    status: true,
  });
  console.log('Bible was added')
  mongoose.disconnect();
}

seed();