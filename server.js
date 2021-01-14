const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.js')

const app = express();


app.get('/', (req, res) =>{
    res.send(JSON.stringify({message:"Hello"}))
})

const db = require('./config/keys.js').MongoURI
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true})
.then(()=>console.log('database connected')).catch((err)=>console.log(err))

app.use(express.json())
app.use('/api',userRouter);



app.listen(4000,()=>console.log('server listening on 4000'))