const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.js');
const env =require('dotenv')
env.config();
const app = express();

const PORT = process.env.PORT || 8000;

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



app.listen(PORT,()=>console.log(`server listening ${PORT}`))