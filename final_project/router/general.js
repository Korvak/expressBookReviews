const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!password || !username) {
    return res.status(400).json({message : "missing either username or password fields."});
  } 
  let email = req.body.email;
  if (!isValid(username) ) {
      users.push({
        "username" : username,
        "password" : password,
        "email" : email
      });
      console.log(users);
      return res.status(200).json({message : `Created user : ${username} now you can login`});
  }
  else {
    return res.status(501).json({message : `The username : ${username} is already taken.`});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send({"books" : books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  return book ? res.send(book) : res.status(404).json({message: `A book with isbn code ${isbn} was not found.`});
 });

//get all books by isbn search
public_users.get('/isbn/search/:isbn', function(req, res) {
    let isbn = req.params.isbn;
    if (!isbn) {
      return res.status(400).json({message : "missing isbn code"});
    }
    isbn = isbn.toLowerCase();
    let bookIsbns = Object.keys(books).filter(x => x.toLowerCase().startsWith(isbn));
    let results = [];
    for (let isbn in bookIsbns) {
      results.push( books[isbn]);
    }
    return res.send(results);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author.toLowerCase();
  let filtered = Object.values(books).filter(x => x.author.toLowerCase().startsWith(author) );
  return res.send(filtered);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title.toLowerCase();
  let filtered = Object.values(books).filter(x => x.title.toLowerCase().startsWith(title) );
  return res.send(filtered);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  return res.send(book["reviews"]);
});

module.exports.general = public_users;
