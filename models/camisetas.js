const mongoose = require('mongoose')
const Schema = mongoose.Schema

const camisetasSchema = new Schema({
    name:String,
    description:String,
    image:String,
    value:Number,
    size:Schema.Types.Mixed
})

const Camisetas = mongoose.model('camisa', camisetasSchema)

module.exports = Camisetas