const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filtered = users.filter(x => {x.username === username});
    return filtered.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let filtered = users.filter(x => x.username == username && x.password == password);
    console.log(filtered);
    return filtered.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message : "missing either username or password fields."});
  }
  if (authenticatedUser(username, password) ) {
    //we generate the token
    const token = jwt.sign(
      {
        "username" : username,
        "password" : password
      },
      "ADLWEUIW3229371ADWKLAJ£221",
       { expiresIn: "1h"});
    //we register it in the session
    req.session.authorization = {
        "accessToken" : token,
        "username" : username
    };
    console.log(token, req.session);
    return res.status(200).json({message : `Logged in as ${username}.`});
  }
  else {
    return res.status(403).json({message: "Password or username do not match. Please try again."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let user = req.user; //added with the login
  let review = req.body.review;
  let book = books[isbn];
  if (book) {
    //nothing gets saved because this is a toy example that doesn't use DBs.
    book["reviews"][user.username] = review; //only one per user per book can exist
    return res.status(200).json({message : "review added"});
  }
  else {
    return res.status(404).json({message : `Could not find book with the following isbn code : ${isbn}`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let user = req.user; //added with the login if missing shouldn't pass at all
  let book = books[isbn];
  if (book) {
    //nothing gets saved because this is a toy example that doesn't use DBs.
    delete book["reviews"][user.username]; //only deletes the review of the username we have logged in
    return res.status(200).json({message : "review added"});
  }
  else {
    return res.status(404).json({message : `Could not find book with the following isbn code : ${isbn}`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
