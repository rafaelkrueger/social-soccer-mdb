const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    name:String,
    email:String,
    cpf:String,
    cellphone:String,
    cep:String,
    rua:String,
    bairro:String,
    cidade:String,
    estado:String,
    camisetas:Schema.Types.Mixed,
    size:Schema.Types.Mixed
})

const Customer = mongoose.model('customer', customerSchema)

module.exports = Customer