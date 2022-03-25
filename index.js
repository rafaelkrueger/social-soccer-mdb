const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")
const bcrypt = require("bcryptjs")
const stripe = require('stripe');
const PORT = 3004

//Database
const mongoose = require("mongoose");
const CamisaMain = require("./camisasMain")
const newUsuarios = require("./usuariosbd.js")

//middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    app.use(cors())
    next()
})

//Database connection
mongoose.connect('mongodb://localhost/produtos',
{useNewUrlParser: true, 
    useUnifiedTopology: true}).then(()=>{
    console.log("Banco conectado!")
}).catch((err)=>{
    console.log(err)
})

//Routa de camisas Main

app.get('/produtos-main', (req, res)=>{
       
    CamisaMain.find().then((produtos)=>{
        res.send(produtos)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/produtos-main-singlepage/:_id', (req, res)=>{
       
    CamisaMain.findOne({_id:req.params._id})
    .then((produtos)=>{
        console.log(produtos)
        res.send(produtos)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/search-produtos-main/:time', (req, res)=>{
       
    CamisaMain.find({time:req.time.params}).then((produtos)=>{
        res.send(produtos)
    }).catch((err)=>{
        console.log(err)
    })
})

app.post('/new-camisa-main', ((req, res)=>{
    console.log("Acessado!")
    new CamisaMain({
            time:req.body.time,
            descricao:req.body.descricao,
            preco:req.body.preco,
            tamanhos:"P M G GG",
            image:req.body.image 
    }).save()
        .then((response)=>{
            console.log("camisa inserida " + response)
        })
            .catch((err)=>{console.log(err)})
    
}))

app.post("/delete-camisa-main", (req, res)=>{
    CamisaMain.deleteOne({_id:req.body._id})
   .then((deletados)=>{
       console.log(deletados)
   }).catch((err)=>{
       console.log(err)
   }) 
})

//Rota de inserir usuario

app.get('/lista-usuarios', (req, res)=>{
    newUsuarios.find()
    .then((user)=>{
        res.send(user);
    })
    .catch((err)=>{
        console.log(err);
    })

})



app.post('/inserir-usuario', (req, res)=>{
    
    new newUsuarios({
        email:req.body.newUsuario,
        password:req.body.password,
        adress:" ",
        number:req.body.number,
        CPF:req.body.CPF, 
    }).save()
    .then((response)=>{
        console.log("Novo usuario inserido! " + response)
    })
    .catch((err)=>{console.log(err)})
})

app.post("/delete-user", (req, res)=>{
    newUsuarios.deleteOne({_id:req.body._id})
   .then((deletados)=>{
       console.log(deletados)
   }).catch((err)=>{
       console.log(err)
   }) 
})

app.post("/login-usuario", (req, res)=>{

    newUsuarios.find({email:req.body.usuario, password:req.body.password})
    .then((user)=>{
        if(console.log(user[0].isAdmin == 0)){
            console.log("Direcionar para Carrinho")    
        }else{
            console.log("Direcionar para ADMIN")
        }
    })
    .catch((err)=>{
        console.log(err)
    })

})

app.get('/purchase', (req,res)=>{
    const session = stripe.checkout.sessions.create({
        payment_method_types: ['cards'],
        line_items:[
            {
                price_data:{
                    currency:'brl',
                    product_data:{
                        name:'Premium Encurtador de Link',
                    },
                    unit_amount:2000,
                },
                quantity:1,
            },
        ],
        mode:'payment',
        success_url:'http://localhost:3000/purchase',
        cancel_url:'http://localhost:3000'
    });
    res.json({url:session.url})
})

//Door
app.listen(process.env.PORT || PORT,()=>{
    console.log("Running")
})