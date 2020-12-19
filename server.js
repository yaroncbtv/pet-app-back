



const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
var cors = require('cors')
app.use(cors())
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { body, validationResult } = require('express-validator');

const url = 'mongodb+srv://yaron:Yaron052@cluster0.3idvo.mongodb.net/YaronDB?retryWrites=true&w=majority';

// Use connect method to connect to the Server





// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// mongoose.connect('mongodb+srv://yaron:Yaron052@cluster0.3idvo.mongodb.net/YaronDB?retryWrites=true&w=majority', {useNewUrlParser: true});


// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('mongoDB Connected!');
// });
let arrDB =[];
app.get('/users', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);

    const dbo = client.db("test");
    //var cursor = db.collection('users').find({});
  //   function iterateFunc(doc) {
  //     // console.log(JSON.stringify(doc, null, 4));
  //     let resultFromDB = JSON.stringify(doc, null, 4)
  //     resultFromDB = JSON.parse(resultFromDB)
  //   }
   
  //  function errorFunc(error) {
  //     console.log(error);
  //  }
  // cursor.forEach(iterateFunc, errorFunc);
  
  // client.close();

  dbo.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result)
    client.close();
  });
  });

})



app.post('/signup', [
  
  body('email').isEmail(),
  body('password').isLength({ min: 1 }),
  body('configPassword').isLength({ min: 1 }),
  body('phone').isNumeric(),
  body('configPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
  
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    console.log('work')

    MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
  
    const db = client.db("test");
    if (err) throw err; 
    db.collection('users').insertOne({
      name: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phone,
      password: req.body.password
    })
  
  
  .then(function(result) {
    // process result
    res.send("succsses")
    console.log("Record inserted Successfully");
  })
  
    client.close();
  });

});

// app.post('/signup', (req, res) => {
//   MongoClient.connect(url, function(err, client) {
//     assert.equal(null, err);
  
//     const db = client.db("test");
//     if (err) throw err; 
//     // db.collection('inventory').insertOne({
//     //   name: req.body.firstName,
//     //   lastName: req.body.lastName,
//     //   email: req.body.email,
//     //   phoneNumber: req.body.phone,
//     //   password: req.body.password
//     // })
//     db.createUser(
//       {
//         user: "reportsUser",
//         pwd: passwordPrompt(),  // Or  "<cleartext password>"
//         roles: [ ]
//       }
//    )
//   .then(function(result) {
//     // process result
//     res.send("succsses")
//     console.log("Record inserted Successfully");
//   })
  
//     client.close();
//   });

  
  
//     //console.log(req.body)
//     //res.send(test)
      
// })


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})