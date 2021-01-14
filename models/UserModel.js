const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum: ['superadmin-0','admin-1','employee-2'],
        default:'employee-2'
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const User = mongoose.model('User',Userschema)
module.exports = User;