const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// set up express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

// set up mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

// set up routes

app.use("/users", require("./routes/userRouter"));
app.use("/pets", require("./routes/petsRouter"));


app.get("/all-user", async (req, res) => {
  
  MongoClient.connect(process.env.MONGODB_CONNECTION_STRING, function(err, db) {
    assert.equal(null, err);
    
    var dbo = db.db("petapp");    //var cursor = db.collection('users').find({});
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
      
    });
    db.close();
  });
  
  });


app.get('/server', function (req, res) {
  res.send('Server is Work!')
})
