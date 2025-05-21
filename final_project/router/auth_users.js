const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validuser=users.filter((user)=>user.username===username && user.password===password);
  if(validuser.length>0){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(!username || !password){
    return res.json({message:"error logging in"})
  }

  if(authenticatedUser(username,password)){
    let accessToken=jwt.sign({
      data:password
    },"access",{expiresIn:60*60})
    req.session.authorization={
      accessToken,username
    }
    return res.send("user loggin in")
  }else{
    return res.send("invalid user")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let review=req.query.reviews;
  let isbn=req.params.isbn;
  let username=req.session.username;
  if(!books[isbn]){
    return res.send("book not found")
  }
  if(!username){
    return res.send("user not logged in")
  }
  if(!review){
    return res.send("review not provided")
  }

  books[isbn].review[username]=review;
  return res.status(300).json({message: "Book review Added"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn=req.params.isbn;
  let username=req.session.username;

  if(!books[isbn]){
    return res.send("book not found")
  }

  if(!username){
    return res.send("username not found")
  }
  const reviews=books[isbn].reviews;

  if(reviews && reviews[username]){
    delete reviews[username]
    return res.send("user review deleted")
  }else{
    return res.send("review not found")
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
