const taskmodel = require('../models/taskmodel')
const { StatusCodes } = require('http-status-codes')

const createTask=async (req,res)=>{

    console.log(req.body);
    const task= await taskmodel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message:"Task Added" });
  }



const getTask=async (req,res)=>{
    taskmodel.find({},(error,data)=>{
      if(error){
        console.log(error);
      }
      else{
        res.json(data);

      }
    })
  }  

const deleteTask=async (req,res)=>{
    taskmodel.deleteOne({"key":req.params.id},(error,data)=>{
        if(error){
            console.log(error);
          }
          else{
            res.json({message:"Task deleted"});
          }
    })
 }

const updateTask=async (req,res)=>{

   taskmodel.updateOne({"key":req.params.id},req.body,(error,data)=>{
    if(error){
        console.log(error);
      }
      else{
        res.json({message:"Task updated"});
      }
})
}
const getTaskFromId=async (req,res)=>{
    taskmodel.find({"key":req.params.id},(error,data)=>{
      if(error || data.length===0){
        res.json({message:"No task found with given Id"});
      }
      else{
        res.json(data);

      }
    })
  }  


module.exports={createTask,getTask,deleteTask,updateTask,getTaskFromId}