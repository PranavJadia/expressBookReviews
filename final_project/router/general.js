const express = require('express');
const axios=require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



const doesExist=(username)=>{
    let userswithsamename=users.filter((user)=>{
        return user.username===username
    })

    if(userswithsamename.length>0){
        return true;
    }else{
        return false;
    }
}


public_users.get('/testbooks', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/'); // Fetch using Axios
    res.status(200).json({
      message: 'Books fetched using Axios',
      data: response.data
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching books',
      error: err.message
    });
  }
});


public_users.post("/register", (req,res) => {
  //Write your code here
 const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    return res.send(JSON.stringify(books,null,4))
});

public_users.get('/async-isbn/:isbn', async (req,res)=>{
  const isbn=req.params.isbn;
  try{
    const response= await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.json({
      message:"book fetched",
      data:response.data,
    })
  }catch(error){
    res.json({
      message:"book not fetched",
      error:error.message,
    })
  }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  let book;
  if(isbn){
     book=books[isbn];
  }
  return res.send(book);
 });
  
 public_users.get('/async-author/:author', async (req,res)=>{
   const author=req.params.author;
   try{
     const response= await axios.get(`http://localhost:5000/author/${author}`);
     res.json({
       message:"book fetched",
       data:response.data,
     })
   }catch(error){
     res.json({
       message:"book not fetched",
       error:error.message,
     })
   }
 })
 // Get book details based on author
 public_users.get('/author/:author',function (req, res) {
   //Write your code here
  let author=req.params.author;
  let matchingbooks=[];

  const bookkeys=Object.keys(books)
  for(let key of bookkeys){
    const book=books[key];
    if(book.author===author){
      matchingbooks.push({isbn:key,...book});
    }
  }

  if(matchingbooks.length>0){
    return res.send(matchingbooks);
  }else{
    return res.status(403).json({message:"not available"})
  }

});
 public_users.get('/async-title/:title', async (req,res)=>{
   const title=req.params.title;
   try{
     const response= await axios.get(`http://localhost:5000/title/${title}`);
     res.json({
       message:"book fetched",
       data:response.data,
     })
   }catch(error){
     res.json({
       message:"book not fetched",
       error:error.message,
     })
   }
 })

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;
  let matchingbooks=[];

  const bookkeys=Object.keys(books)
  for(let key of bookkeys){
    const book=books[key];
    if(book.title===title){
      matchingbooks.push({isbn:key,...book});
    }
  }

  if(matchingbooks.length>0){
    return res.send(matchingbooks);
  }else{
    return res.status(403).json({message:"not available"})
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  let reviews=books[isbn].reviews
  return res.send(reviews);
});



module.exports={
  general:public_users,
}