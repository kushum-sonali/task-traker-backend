const express= require("express");
const app= express();
app.use(express.json());
const cors=require('cors');
const port= process.env.PORT||3000;
app.use(cors({
  origin: 'https://task-traker-frontend.vercel.app',  // Allow only your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Specify allowed methods
  credentials: true,  // Include credentials if needed
}));
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken');
require('./mongodb')
const User= require('./userModel');
const Task= require('./todoModel');

app.get("/tasks/:id",async(req,res,next)=>{
  try{
    const {id}= req.params;
    if(!id){
      res.status(400).send({message:"user not found"});
    }
    const result= await Task.find(
      {createdBy:id}
    )
    res.status(200).json({message:"task",result})
    console.log("helloo",id);

  }
  catch(e){
    console.log(e)
  }
})


app.post('/signup',async(req,res,next)=>{
    try{
        const {fullName,email,phone,password}=req.body;
        if(!fullName || !email || !phone || !password){
            res.status(400).send({message:"require all feild"});
        }
        // console.log(fullName,email,phone,password);
const saltvalue=10;
const hashpass=await  bcrypt.hash(password,saltvalue);
const newUser=new User ( {
    fullName,
    email,phone,

    password:hashpass
}
)
const result = await newUser.save();
res.status(200).send({message:"signup succesfully",result});
console.log("signup succesfully");


    }
    catch(e){
        next(e);
        console.log("something wrong");
    }
})

app.post('/login',async(req,res,next)=>{
    try{
        const {email,password:pass}=req.body;
        if(!email || !pass){
            res.status(400).send({message:"require all feild"});
        }
        const userFind= await
        User.findOne({email});
        if(!userFind){
            res.status(400).send({message:"user not found"});
        }
        const isMatch= await bcrypt.compare(pass,userFind.password);
        if(!isMatch){
            res.status(400).send({message:"password or user not match"});
        }
       
        const token = jwt.sign({name:userFind.fullName,
            email:userFind.email,
        },"privetKey",{expiresIn:'1h'})

        
        res.status(200).send({message:"login successfully",data:{token,user_id:userFind.id,userFind}},)
        
        
        
    }

    catch(e){
        next(e);
        console.log("something wrong",e);
    }
})

app.post("/addtask", async (req, res, next) => {
    try {
      const { title, date, time, desc, completed,createdBy } = req.body;
      const userFind= await User.findById(
        
        createdBy
      )
      if(userFind){
      const newTask = new Task({ title, date, time, desc, completed,createdBy});
      
      console.log(newTask);
      const result = await newTask.save();
      console.log(result);
      
      res.status(200).json(result);
      }
    } catch (e) {
      next(e);
      console.log("Something went wrong");
    }
  });
  

// Backend - app.js (Express)

// DELETE Task Endpoint
app.delete("/deletetask/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Task.findByIdAndDelete(id); // Using Mongoose to find and delete by ID
    if (!result) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (e) {
    next(e);
    console.log("Something went wrong");
  }
});

// PUT Task Endpoint - To update a task
app.put("/updatetask/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;
  console.log(title,desc); 

    // Ensure that the title and description are provided
    if (!title || !desc) {
      return res.status(400).send({ message: "Title and description are required." });
    }

    // Find the task by ID and update the title and description
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, desc },
      { new: true} // new: true to return the updated document, runValidators to validate fields
    );

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send({ message: "Task updated successfully", task: updatedTask });
  } catch (e) {
    console.error("Something went wrong", e);
    res.status(500).send({ message: "Internal server error" });
    next(e);
  }
});
app.post("/task/completed/:id", async (req, res, next) => {
const {id}=req.params;
const TaskFind= await Task.findByIdAndUpdate(id,{completed:true},{new:true});
if(!TaskFind){
  return res.status(404).send({message:"Task not found"});
}
res.status(200).send({message:"Task completed successfully",task:TaskFind});

})

app.post("/firebaseuser", async (req, res, next) => {
  try {
    const { fullName, email, firebaseId } = req.body;
    if (!fullName || !email || !firebaseId) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const findUser = await User.findOne({ email });
    if (findUser) {
      // Convert findUser to a plain object
      const userObject = findUser.toObject();
      // Remove password from the object if it exists
      delete userObject.password;
      console.log("userObject",userObject)
      
      return res.status(200).send({ message: "Login successfully", user: userObject });
    }

    const newUser = new User({
      fullName,
      email,
      firebaseId,
      isGoogleSignin: true
    });
    
    const userToSave = await newUser.save();
    const savedUserObject = userToSave.toObject();
    delete savedUserObject.password; // Ensure password isn't sent back if it's stored

    return res.status(201).send({ message: "User registered successfully", user: savedUserObject });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

 

app.listen(port,()=>{
    console.log(`server is running on the ${port}`);
})
