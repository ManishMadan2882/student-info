const express = require('express')
const app  =  express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const port = 5050

const pool = require('./db')

app.use(express.json())

app.post('/register',async (req,res)=>{
    const email = req.body.email;
    const password =await bcrypt.hash(req.body.password,4);
    const token = jwt.sign(
      { email },
      "thisisanassignmentiamdoingtoday",
      {
        expiresIn: "2d",
      }
    );
    console.log(token);
      

})

app.listen(port,()=>{
  console.log(`Server running at ${port}`);
});
