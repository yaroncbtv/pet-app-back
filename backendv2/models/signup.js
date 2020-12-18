import mongoose from 'mongoose';
  const { Schema } = mongoose;

  const user = new Schema({
    name:  String, // String is shorthand for {type: String}
    email: String,
    password:   String,
  });


const signup = mongoose.model('user', user);

module.exports = signup;