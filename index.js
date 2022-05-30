const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")
const bcrypt = require("bcryptjs")
const Camisetas = require("./models/camisetas")
const PORT = process.env.PORT || 3004
const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_51IXWAzI065aszrHxziqFhlIvzUnV8kYKL1GOulI7Xp0EvAFm6aAIFdo75wuhl4CqByb92fGeryTh9oHrP4jTVchN00SNCKdTzb")
const uuid = require("uuid")

//middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    app.use(cors())
    next()
})


//Database connection
mongoose.connect("mongodb+srv://rafaelkrueger:Vidanormal01@social-soccer.r5vh4.mongodb.net/social-soccer?retryWrites=true&w=majority",
{useNewUrlParser: true, 
    useUnifiedTopology: true}).then(()=>{
    console.log("Banco conectado!")
}).catch((err)=>{
    console.log(err)
})

//promisses
const sleep = (ms) =>{
    return new Promise((resolve) => setTimeout(resolve,ms))
}

/*const newCamisa = new Camisetas({
    name:"Paris Saint German",
    description:"dasjdlaskjdslkajld",
    image:"daskdçaskdçasdk",
    value:55,
    size:"M"
})
newCamisa.save((err, camisa)=>{
    if(err) console.log(err)
    console.log(camisa)
})*/

/*Camisetas.findOneAndDelete({name:"dsads"},(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Deleted")
})*/

app.get("/", (req,res)=>{

    res.send("working!")    

})


app.get("/camisetas", async (req,res)=>{

    const main = async () =>{
        await sleep(15000)
        const FindCamisa = await Camisetas.find().exec((err,camisa)=>{
            if(err)console.log(err)
            res.send(camisa)
        })
    }
    main();            
})

app.get("/camisetas-search", async (req,res)=>{
    search = req.body.search
    const main = async () =>{
        await sleep(15000)
        const FindCamisa = await Camisetas.findAll({name:search}).exec((err,camisa)=>{
            if(err)console.log(err)
            res.send(camisa)
        })
    }
    main();        
    
})


app.get("/camisetas/:_id", async (req, res)=>{
    const main = async () =>{
        await sleep(15000)
        const FindCamisa = await Camisetas.findOne({_id:req.params}).exec((err,camisa)=>{
            if(err)console.log(err)
            res.send(camisa)
        })
    }
    main();        

})

//payment route

app.post("/payment", cors(), async (req, res)=>{
    let {name,amount, id, cpf } = req.body
    try{
        const payment = await stripe.paymentIntents.create({
            amount,
            currency:"BRL",
            description:name,
            payment_method:id,
            confirm:true
        })
        console.log("Payment", payment)
        res.json({
            message:"Paymeny Success",
            success:true
        })
    }catch(error){
        console.log("error",error)
        res.json({
            message:"payment Failed",
            success:false
        })
    }
})



//Door
app.listen(PORT,()=>{
    console.log("Running")
})
