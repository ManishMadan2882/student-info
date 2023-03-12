const express = require('express')
const app  =  express()
const csv =  require('csv')
const path = require('path')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const port = 5054
const fs = require('fs')
const secret_key = "thisentiamdoingtoday"
const pool = require('./db')
const multer = require('multer')
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
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './uploads/')
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + path.extname(file.originalname),
    )
  },
});

var upload = multer({
  storage: storage,
})
app.post('/api/uploadcsv', upload.single('uploadcsv'), (req, res) => {
  csvToDb(__dirname + '/uploads/' + req.file.filename)
  res.json({
    msg: 'File successfully inserted!',
    file: req.file,
  })
});

function csvToDb(csvUrl) {
  let stream = fs.createReadStream(csvUrl)
  let collectionCsv = []
  let csvFileStream = csv
    .parse()
    .on('data', function (data) {
      collectionCsv.push(data)
    })
    .on('end', function () {
      collectionCsv.shift()
      pool.connect((error) => {
        if (error) {
          console.error(error)
        } else {
          let query = 'INSERT INTO public.studentdata (id, name, email) VALUES ?'
          pool.query(query, [collectionCsv], (error, res) => {
            console.log(error || res)
          })
        }
      })
      fs.unlinkSync(csvUrl)
    })
  stream.pipe(csvFileStream)
}


app.get('/download',(req,res)=>{
  res.download( path.join(__dirname,'./uploads/uploadcsv.csv'), function(err) {
   console.log('Error:'+err);
  })
})


app.listen(port,()=>{
  console.log(`Server running at ${port}`);
});
