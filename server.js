const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.js');
const env =require('dotenv')
env.config();
const app = express();


app.get('/', (req, res) =>{
    res.send(JSON.stringify({message:"Hello"}))
})

//database connection
const db = require('./config/keys.js').MongoURI
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true})
.then(()=>console.log('database connected')).catch((err)=>console.log(err))

//middleware
app.use(express.json())

//routes
app.use('/api',userRouter);



app.listen(4000,()=>console.log('server listening on 4000'))