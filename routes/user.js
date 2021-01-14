const express = require('express');
const router = express.Router();
const User = require("../models/UserModel.js")
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET }= require('../config/keys.js');
// const requireLogin = require('../middleware/requireLogin.js')

// router.get('/protected',requireLogin,(req, res)=>{
//     res.send().json({message:"hi user"});
// })



// route to register as ['superadmin-0','admin-1','employee-2']
router.post('/register', (req, res)=>{
    const {username,email,role,password} = req.body
    if(!username ||!email ||!password){
       return res.status(400).json({error:"please fill all the fileds"})
    }
    User.findOne({email:email}).then((saveduser)=>{
        if(saveduser){
            return res.status(422).json({error:'user alerdy exits with the email'})
        }
        bcrypt.hash(password,10).then(hashedpassword=>{
            const user = new User({email,password:hashedpassword,username,role})
            user.save().then(user=>{
                res.status(200).send(user)
            }).catch(err=>{console.log(err)})
        })
        }).catch(err=>{console.log(err)})
       
})

// router.post('/signin', (req, res)=>{
//     const {email, password} =req.body
//     if(!email||!password){
//         return res.status(422).json({error:"please enter a valid email or password"})
//     }
//     User.findOne({email:email}).then(saveduser=>{
//         if(!saveduser){
//             return res.status(422).json({message:"invalid email or password"})
//         }
//         bcrypt.compare(password,saveduser.password).then(doMatch=>{
//             if(doMatch){
//                 // return res.json({message:"sucessful loged in"})
//                 const token = jwt.sign({_id:saveduser.id},JWT_SECRET)
//                 res.json({token})
//             }
//             else{
//                 return res.status(422).json({message:"invalid email or password"}) 
//             }
//         })
//     }).catch(err =>{console.log(err)})
// })



//Get all the users (paginated results)

router.get('/users',paginatedmodel(User),(req,res)=>{
    res.json(res.paginatedmodel)
})

//middleware for paginated results
function paginatedmodel(userdata){
    return async (req,res,next)=>{
        const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit)

            const startindex = (page-1)*limit
            const endindex = page*limit

            const results ={}

            if(endindex < await userdata.countDocuments().exec()){
                results.next={
                    page:page+1,
                    limit:limit
                }
            }
            if(startindex>0){
                results.previous ={
                    page:page-1,
                    limit:limit
                }
            }
        
        try{
            results.results =await userdata.find().limit(limit).skip(startindex).exec()
            res.paginatedmodel =results
            next()
        }
        catch(err) {
            res.status(500).json({message:err.message})
        }
    }
}  
// created a class api for flitering and sorting
class apis{
    constructor(query,queryString){
        this.query =query;
        this.queryString =queryString;
    }
    filtering(){
        const queryobj = {...this.queryString};
        const excludedfileds = ['page','sort','limit'];
        excludedfileds.forEach(el => delete queryobj[el]);
        let querystr =JSON.stringify(queryobj);
        querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, match =>`&&{match}`);
        this.query.find(JSON.parse(querystr));
        return this

    }
    sorting(){
        if(this.query.sort){
            const sortby =this.queryString.sort
            this.query =this.query.sort(sortby);
        }
        else{
            this.query =this.query.sort('-createdAt');
        }
        return this;
    }
}

// to get users by role and by createdAt
router.get('/post',async(req,res)=>{
    try{
        const features = new apis(User.find(),req.query).filtering().sorting();

        const users = await features.query;
        res.send(users)
    }catch(err){
        console.log(err)
    }
})
module.exports = router