const express=require("express");
const app=express();
const cors = require('cors');
const passport=require("passport");
const LocalStrategy=require('passport-local').Strategy;
const port=process.env.PORT || 3000;
//to get MongoDB Url from .env file 
require('dotenv').config(); 
//function to connect to database
const connectDB = require('./db/connect'); 
const User = require('./models/usermodel')
const session=require("express-session");  


//Swagger

const swaggerUI=require("swagger-ui-express");
const YAML=require("yamljs");
const swaggerDocument=YAML.load("./swagger.yaml");


//Middlewares
app.use(cors());
app.use(session({secret: 'secret',
     resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());    //to parse json data
app.use(
    express.urlencoded({ extended: true })
);

//routers
const taskRouter=require("./routes/task");


//local strategy for passport
passport.use(new LocalStrategy(
    function(username,password, done) {
        User.findOne({ username: username }, function (err, user) {
        if (err) { 
            return done(err); };
        if (!user) { 
            return done(null, false,{message:'wrong username or password'}); };
        if (!user.password==password){ return done(null, false,{message:'incorrect password.'}); }
        return done(null, user);
      });
    }
  ));


//serialization
passport.serializeUser((user,done)=>{
    if(user){
       return done(null,user.id)
    }
    return done(null,false)
});


//deserialization
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        if(err) return done(null,false);
        return done(null,user)
    })
})




//Registration route
app.post("/api/v1/registration",(req,res,done)=>{

    User.findOne({username:req.body.username},(err,user)=>{
        if(err)done(null,false);
        else if(user) res.json("user already exists")
        else{
            console.log(req.body);
            User.create({username:req.body.username,password:req.body.password},(err,user)=>{
                if(err){ done(null,false)
                console.log(err);
                }
                console.log(user);
                done(null,user)
            })
        }
    })

},
    passport.authenticate('local'),function(req,res){
        res.json({message:"Registration complete"})
    }
);
//Home route
app.get("/",(req,res)=>{
    res.json("<h1>Node Assignment</h1><a href='/docs'>Swagger Documentation</a>");
})

//swagger docs route

app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerDocument));

//login route
app.post("/api/v1/login",passport.authenticate('local'),function(req,res){
    console.log(req.user);
    res.json({message:"Logged in successfully"})
});



//Task router
app.use("/api/v1/task",taskRouter);



//Starting server
const start=async()=>{
    try{
       await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log("server running at port",port)
        })
    }
    catch(err){
        console.log(err);
    }
};
start();