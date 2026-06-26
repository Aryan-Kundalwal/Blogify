require("dotenv").config();
const { connectTOMongoDB } = require("./connect");
const express = require("express")
const path = require("path")
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require("./middlewares/authentication")
const Blog =require("./models/blog")
const User = require("./models/user")


const app = express()
const PORT = process.env.PORT || 8000;


let isConnected = false;

const startDB = async () => {
  if (isConnected) return;

  try {
    await connectTOMongoDB(process.env.MONGO_URL);
    isConnected = true;
    console.log("MongoDB Connected !");
  } catch (err) {
    console.log("DB Error:", err);
  }
};

app.set("view engine" , "ejs")
app.set("views" ,path.resolve("./views"))

app.use(express.urlencoded({extended : false}))
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))

app.use(express.static(path.resolve('./public')))




app.get("/" , async (req , res) => {
     const allBlogs = await Blog.find({})
     
    
    return res.render("home",{
         user : req.user,
         blogs : allBlogs,
       
        
    })
  
   
})

app.use("/user" , userRoute)
app.use("/blog" , blogRoute)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
  });
}

module.exports = app;
