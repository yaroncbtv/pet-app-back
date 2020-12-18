



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

app.get('/users', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    


    const db = client.db("test");
    var cursor = db.collection('inventory').find({});
    function iterateFunc(doc) {
      // console.log(JSON.stringify(doc, null, 4));
      let resultFromDB = JSON.stringify(doc, null, 4)
      resultFromDB = JSON.parse(resultFromDB)
      console.log(resultFromDB)
   }
   
   function errorFunc(error) {
      console.log(error);
   }
   
  cursor.forEach(iterateFunc, errorFunc);
 
  
  client.close();
  });

  res.send('Hello World!')
})


app.post('/signup', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
  
    const db = client.db("test");
    if (err) throw err; 
    console.log("Record inserted Successfully");
    db.collection('inventory').insertOne({
      name: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phone,
      password: req.body.password
    })
  .then(function(result) {
    // process result
    res.send("succsses")
    
  })
  
    client.close();
  });

  
  
    //console.log(req.body)
    //res.send(test)
      
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})