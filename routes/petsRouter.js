const router = require("express").Router();
const Pets = require("../models/petsModel");

let id = 0;
router.post('/add-pet', async function (req, res) {

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
    })
    
    router.get("/get-pet", async (req, res) => {
      try {
        await Pets.find({}, function(err, pets) {
          res.send(pets);  
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
//$or: [name: { $regex: search, $options: "i" }, type: { $regex: search, $options: "i" } ]
    router.get("/pet-search/:search", async (req, res) => {
      try {
        var search = req.params.search;
        const pets = await Pets.find({
          $or:[{name: { $regex: search, $options: "i" }},
          {type: { $regex: search, $options: "i" }},
        ]}, function(err, docs) {
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
