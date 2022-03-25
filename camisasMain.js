const mongoose = require("mongoose");
const Schema = mongoose.Schema
const mongodb = require("mongodb");


const NovoCamisaMain = new Schema({
    time:{
        type:String,
        required:true,
    },
    descricao:{
        type:String,
        required:true,
    },
    preco:{
        type:Number,
        required:true
    },
    tamanhos:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    data:{
        type:Date,
        default:Date.now(),
    },
});

mongoose.model("NovoCamisaMain", NovoCamisaMain)

const CamisaMain = mongoose.model("NovoCamisaMain")

module.exports= CamisaMain