const express = require('express')
const app = express()
const port = 4000
const mongoose = require('mongoose');
var cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId;
const {Schema,model}=mongoose



mongoose.connect('mongodb+srv://adhayan436:k49fdx7rO0l2CFgr@cluster0.gzbhwzt.mongodb.net/?retryWrites=true&w=majority');


const bookSchema = new Schema({
  bookTitle: String,
  category: String,
  author: String,
  imageURL: String,          
  bookDescription: String, 
  bookPDFURL: String,        
});


bookSchema.index({ bookTitle: 1, author: 1 }, { unique: true });

const Book =model('Book', bookSchema);

app.use(cors())
app.use(express.json())

app.post("/upload-book",async(req,res)=>{
  try{
    const data=req.body
    const book=new Book(data);
    const result = await book.save();

    res.send(result);
  }catch(error){
    if (error.code === 11000) {
      res.status(400).json("A book with the same title and author already exists.");
    } else {
      res.status(500).json({ error: error.message });
    }
  }
})

app.get("/all-books", async (req, res) => {
  try {
    const allBooks = await Book.find({});
    res.send(allBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateBookData = req.body;
    const result = await Book.findByIdAndUpdate(id, updateBookData, { new: true });
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/book/:id",async (req,res)=>{
  try{
    const id=req.params.id
    const result=await Book.findByIdAndDelete(id)
    res.send(result)
  }catch(error){
    res.status(500).json(error)
  }
})

app.get("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Book.findById(id);

    if (!result) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app