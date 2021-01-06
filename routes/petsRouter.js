const router = require("express").Router();
const Pets = require("../models/petsModel");
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let id;
router.post('/add-pet', async function (req, res) {

  MongoClient.connect(process.env.MONGODB_CONNECTION_STRING, async function(err, db) {
    assert.equal(null, err);
    
    var dbo = db.db("petapp");    //var cursor = db.collection('users').find({});
    const collection = dbo.collection("pets");
    const data = await collection.find().map(doc => doc.id).toArray()
    
    if(data.length === 0){
      id = 0;
    }else{
       id = data.length
    }
    
    const { type, name, adoptionStatus, picture, 
      height, weight, color, bio, hypoallergenic, dietaryRestrictions, breed } = req.body;
    const newPet = new Pets({
      id,
      type,
      name,
      adoptionStatus,
      picture,
      height,
      weight,
      color,
      bio,
      hypoallergenic,
      dietaryRestrictions,
      breed
      });
      const savedPets = await newPet.save();
      id++;
      res.json(savedPets);

    db.close();
  });
  
    
    })
    
    router.get("/get-pet", async (req, res) => {
      try {
        const pets = await Pets.find({}, function(err, pets) {
          
        });
        res.json({
          pets
        }); 
      } catch (error) {
        res.status(400)
        .json({ msg: "Bad Reqest. Only Number!" });
      }
    });

    router.get("/get-pet/:id", async (req, res) => {
      try {
        var id = req.params.id;
          const pets = await Pets.findOne({ id });
          res.json({
          pets
          }); 
      } catch (error) {
        res.status(400)
        .json({ msg: "Bad Reqest. Only Number!" });
      }
    });
    router.get("/pet-search/:search?", async (req, res) => {
      try {
        if(!req.params.search)
            res.json(null)

        var search = req.params.search;
        const pets = await Pets.find({
          $or:[{name: { $regex: search, $options: "i" }},
          {type: { $regex: search, $options: "i" }},
        ]}, function(err, pets) {

          });
          res.json({
              pets
            }); 
      } catch (error) {
        res.status(400)
        .json({ msg: "Bad Reqest. Try again" });
      }
    });



    router.get("/get-pet-by-id/:id", async (req, res) => {
      try {
        var id = req.params.id;
        const pets = await Pets.findOne({ id });
        res.json({
        pets
      });
      } catch (error) {
        res.status(400)
        .json({ msg: "Bad Reqest. Only Number!" });
      }
    });


    router.post("/pet/:id/adopt", auth, async (req, res) => {
      try {
         var id = req.params.id;
 
        const filter = { id };
        
        const pets = await Pets.findOne({ id });
        let petAdoptionStatus = pets.adoptionStatus
        petAdoptionStatus = petAdoptionStatus.toLowerCase();
        
        if(petAdoptionStatus === 'foster'){
          let update = { adoptionStatus: 'Adopt' }; 
          let doc = await Pets.findOneAndUpdate(filter, update);
        }else{
          let update = { adoptionStatus: 'Foster' }; 
          let doc = await Pets.findOneAndUpdate(filter, update);
        }
        res.json({
        pets
      });
      

      } catch (error) {
        res.status(400)
        .json({ msg: "Only connect users!" });
      }
    });
    
    router.post("/pet/:id/return", auth, async (req, res) => {
      try {
         
        var id = req.params.id;
 
        const filter = { id };
        
        const pets = await Pets.findOne({ id });

        let update = { adoptionStatus: 'Available' }; 
        let doc = await Pets.findOneAndUpdate(filter, update);
      
        res.json({
        pets
      });
      

      } catch (error) {
        res.status(400)
        .json({ msg: "Only connect users!" });
      }
    });

    router.post("/pet/:id/save", auth, async (req, res) => {
      try {
        
        const user = await User.findById(req.user);

        var id = req.params.id;
 
        const filter = { id };
        
        const pets = await Pets.findOne({ id });

        user.pets.push(pets);
        user.save();

        res.json({
          user
      });
      

      } catch (error) {
        res.status(400)
        .json({ msg: "Only connect users!" });
      }
    });


    router.get("/get-user-save-pet", auth, async (req, res) => {
      try {
        
        const user = await User.findById(req.user);
        const userPets = user.pets;
        
        res.json({
          userPets
      });
      

      } catch (error) {
        res.status(400)
        .json({ msg: "Only connect users!" });
      }
    });


    router.delete("/pet/:id/delete", auth, async (req, res) => {
      try {
        var id = req.params.id;
 
        const filter = { id };
        
        const pets = await Pets.findOne({ id });

        const user = await User.findById(req.user);

        myArray = user.pets.filter(function( obj ) {
          return obj.id !== pets.id;
        });
        user.pets = myArray
        user.save();

        res.json({
          user
      });
      

      } catch (error) {
        res.status(400)
        .json({ msg: "Only connect users!" });
      }
    });
    
    router.get("/pet/user/:id", auth, async (req, res) => {
      try {
        var id = req.params.id;
 
        const filter = { id };
        
        //const userPets = await User.pets.id.findOne({ id });

        const user = await User.findById(req.user);
        let userPets = []

        for(var i = 0; i<user.pets.length; i++){
          if(user.pets[i].id == id){
            userPets.push(user.pets[i])
            }

        } 
        res.json({
          userPets
      });
      

      } catch (error) {
        res.status(400)
        .json({ msg: "Only connect users!" });
      }
    });
   // <--Admin--> 
  //   router.put("/edit-pet-by-id/:id", async (req, res) => {
  //     const { email, _id, displayName, lastName, phone } = req.body;

  // const user = await User.findOne({ email: email });

  // var userId = user._id;

  // var conditions = {
  //  _id : userId 
  // }
  // var update = {
  //   displayName: user.displayName,
  //   lastName: user.lastName,
  //   phone: user.phone,
  //   email: user.email,
  //  }

  // if(email)
  //     update.email = email;
  // if(displayName)
  //    update.displayName = displayName;
  // if(phone)
  //    update.phone = phone;
  // if(lastName)
  //    update.lastName = lastName;
  
  //  User.findOneAndUpdate(conditions,update, async function(error,result){
  //   if(error){
  //     // handle error
  //   }else{
  //     await console.log(result);
  //   }
  // });
      // var id = req.params.id;
      // const pets = await User.findById(id);
      // res.json({
      //   pets
      // });
    //});

module.exports = router;













module.exports = router;
