const mongoose =require("mongoose");

const taskSchema=new mongoose.Schema({
    key: {
        type: Number,
        required: [true, 'Please provide key'],
      },
    task:{
      type: String,
      required:[true,'mention the Task'],
    } 
})

module.exports = mongoose.model('taskmodel', taskSchema)