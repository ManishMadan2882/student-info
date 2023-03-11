const express = require('express')
const app  =  express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const port = 5050
const secret_key = "thisentiamdoingtoday"
const pool = require('./db')
const verifyToken =  require('./auth')
app.use(express.json())

app.post('/register',async (req,res)=>{
    const email = req.body.email;
    const password =await bcrypt.hash(req.body.password,4);
    //const password = req.body.password;
  
     pool.query(`INSERT INTO public.user (email,password) VALUES ('${email}','${password}');`,
      (error, results) => {
      if (error) {
        res.json({"message":error});
       throw error
      }
      res.status(200).json({"message":"registered successfully"})
     })

})

app.post('/login',async (req,res)=>{
   const email = req.body.email;
   const password = req.body.password;
    pool.query(`SELECT password  FROM public.user WHERE email LIKE '${email}';`,async (err,result)=>{
     
      if(result.rows.length == 0){
       return res.status(404).json({'message':'user does not exists'})
      }
    const check =await bcrypt.compare(password,result.rows[0].password);
    if(check)
    {
     const token = jwt.sign(
       { email },
        secret_key,
       {
         expiresIn: "2d",
       }
     );
     req.token = token;
     res.status(200).json({message:'logged in'})
    }
    else{
     res.status(403).json({message:'username or password is wrong'})
    }    
   });
   

   
})

app.get('/import',async(req,res)=>{

  let result =await pool.query(`copy public.studentdata FROM 'SampleStudentsheet.csv' DELIMITER ',';`);

  res.json({result:result})

})
app.get('/export',(req,res)=>{
})


app.listen(port,()=>{
  console.log(`Server running at ${port}`);
});
