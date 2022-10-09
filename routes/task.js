const express=require("express");
const taskRouter=express.Router();
//importing task functions from controllers
const {createTask,getTask,updateTask,getTaskFromId,deleteTask}=require("../controllers/task");

taskRouter.route("/") 
.post(createTask)
.get(getTask);

taskRouter.route("/:id")
.delete(deleteTask)
.patch(updateTask)
.get(getTaskFromId);

module.exports=taskRouter