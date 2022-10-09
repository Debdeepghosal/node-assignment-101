const mongoose =require("mongoose");

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide Name'],
      },
      password: {
        type: String,
        required: [true, 'Please provide Password'],
      },
})

module.exports = mongoose.model('User', userSchema)