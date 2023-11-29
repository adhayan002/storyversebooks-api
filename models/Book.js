// models/book.js
const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  bookTitle: String,
  seller: String,
  category: String,
  author: String,
  imageURL: String,
  bookDescription: String,
  bookPDFURL: String,
}, { strict: false });

bookSchema.index({ seller: 1 }, { unique: true });

const Book = model('Book', bookSchema);

module.exports = Book;
