const mongoose = require("mongoose");
const Schema = mongoose.Schema
const mongodb = require("mongodb");


const Usuarios = new Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    adress:{
        type:String,
        required:false
    },
    number:{
        type:String,
        required:false
    },
    CPF:{
        type:String,
        required:false
    },
    isAdmin:{
        type:Number,
        default:0,
        required:false,
    },
    data:{
        type:Date,
        default:Date.now(),
    },
});

mongoose.model("Usuarios", Usuarios)

const newUsuarios = mongoose.model("Usuarios")

module.exports= newUsuarios