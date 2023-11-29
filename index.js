const express = require('express')
const app = express()
const helmet = require('helmet')
const passport=require('passport')
const port = 4000
const mongoose = require('mongoose');
const cors = require('cors')
const session = require('express-session')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('./models/User');
const Book = require('./models/Book');
const authRoutes = require("./routes/authRoutes");
require("./passport")


const salt = bcrypt.genSaltSync(10);



mongoose.connect('mongodb+srv://adhayan436:k49fdx7rO0l2CFgr@cluster0.gzbhwzt.mongodb.net/?retryWrites=true&w=majority');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({ origin: '*' }));


app.use("/auth",authRoutes)

app.post("/register", async (req, res) => {
  const { username,fullName, password } = req.body;
  try {
    const newUser = await User.create({
      username,
      fullName,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, username: user.username }, 'shashsh', { expiresIn: '1h' });
    res.cookie("jwttoken", token, {
      expires: new Date(Date.now()+3600000),
      httpOnly: false
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/logout', (req, res) => {
 
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token not provided.' });
  }

  // Invalidate or delete the token as needed
  // For simplicity, let's assume you want to delete the token on the client-side
  // In a real-world scenario, you might need to implement token invalidation on the server
  res.clearCookie('Authorization').json({ message: 'Logout successful' });
});


app.post("/upload-book",async(req,res)=>{
  try{
    const data=req.body
    console.log(data)
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

app.get("/books/:name", async (req, res) => {
  try {
    const { name } = req.params;

    // Using a regular expression to perform a case-insensitive partial match
    const matchingBooks = await Book.find({
      bookTitle: { $regex: new RegExp(name, 'i') }
    });

    res.send(matchingBooks);
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

    // Include the seller field in the response
    const { _id, seller, ...bookData } = result.toObject(); // Destructure and exclude _id
    res.json({ ...bookData, seller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", async (req, res) => {
  res.send("Hello")
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
