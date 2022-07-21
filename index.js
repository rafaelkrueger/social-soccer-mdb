if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")
const Camisetas = require("./models/camisetas")
const Customer = require("./models/customer")
const PORT = process.env.PORT || 3004
const mongoose = require("mongoose");
const stripe = require("stripe")("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")


/*Pix Gerencianet*/

const axios = require("axios")
const fs = require('fs')
const path = require("path")
const https = require('https')
app.set('view engine', 'ejs')
app.set('views','./views')

const cert = fs.readFileSync(
    path.resolve(__dirname, `./certs/${process.env.GN_CERT_PROD}`)
)

const agent= new https.Agent({
    pfx:cert,
    passphrase:'',
})

const credentials = Buffer.from(
    process.env.GN_CLIENT_ID + ':' + process.env.GN_CLIENT_SECRET
).toString('base64')


app.get('/pix', async (req,res)=>{
    const authResponse = await axios({
    method:'POST',
    url:`${process.env.GN_ENDPOINT}/oauth/token`,
    headers:{
        Authorization:`Basic ${credentials}`,
        'Content-Type':'application/json',
    },
    httpsAgent: agent,
    data:{
        grant_type:'client_credentials'
    }
    });

    const accessToken = await authResponse.data?.access_token

    const reqGN = axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent:agent,
        headers:{
            Authorization:`Bearer ${accessToken}`,
            'Content-Type':'application/json'
        }
    });

    const dataCob = {
        calendario:{
            expiracao:3600
        },
        valor:{
            original:'100.00'
        },
        chave:'de5d1466-f483-4911-839e-4ab70227dec6',
        solicitacaoPagador:'Cobrança Camiseta de Time'
    };

    //const cobResponse = await reqGN.post(`/v2/cob`, dataCob).catch((err)=>{console.log(err)});
    //const qrcodeResponse = reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`).catch((err)=>console.log(err));
    //res.render('qrcode', {qrcodeImage:qrcodeResponse.data.imagemQrcode})
})
    
app.post('/webhook(/pix)?', (req,res)=>{
    console.log(req.body)
    res.send('200')
})




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

app.post("/new-costumer", (req,res)=>{
    let {name,email, cpf, cellphone, cep, rua, bairro, cidade, estado, camisetas } = req.body  
    const newCustomer = new Customer({
    name:name,
    email:email,
    cpf:cpf,
    cellphone:cellphone,
    cep:cep,
    rua:rua,
    bairro:bairro,
    cidade:cidade,
    estado:estado,
    camisetas:camisetas
    })
    newCustomer.save((err, customer)=>{
        if(err) console.log(err)
        console.log(customer)
    })  

})

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

app.post("/camisetas-search", async (req,res)=>{
/*    search = req.body.search
    const main = async () =>{
        await sleep(15000)
        const FindCamisa = await Camisetas.findAll({name:search}).exec((err,camisa)=>{
            if(err)console.log(err)
            res.send(camisa)
        })
    }
    main();        
*/
console.log("rafael")    
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
            metadata:{name},
            confirm:true,
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



/*Camisetas.findOneAndDelete({name:"dsads"},(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Deleted")
})*/
