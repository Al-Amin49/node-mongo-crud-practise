
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const ObjectId= require('mongodb').ObjectId;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://firstMongo:<password>@cluster0.lmrib.mongodb.net/fashionStore?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
client.connect(err=>{
    const clothsCollection = client.db("fashionStore").collection("Cloth");
    //item create
   app.post("/addCloth", (req,res)=>{
       const cloth= req.body;
      clothsCollection.insertOne(cloth)
      .then(result=>{
    console.log('data added succesfully');
    res.redirect('/');
      })
    
   })
    //item read
   app.get('/clothes', (req,res)=>{
       clothsCollection.find({})
       .toArray((err, documents)=>{
           res.send(documents);
       })
   })

//item update
app.get('/cloth/:id',(req, res)=>{
    clothsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
        res.send(documents[0]);
    })
})

app.patch('/update/:id', (req, res)=>{
    clothsCollection.updateOne({_id: ObjectId(req.params.id)},
    {
        $set:{price:req.body.price, quantity: req.body.quantity}

    })
    .then(result=>{
       res.send(result.modifiedCount>0);
    })
})
   //item delete
   app.delete('/delete/:id',(req,res)=>{
   clothsCollection.deleteOne({_id: ObjectId(req.params.id) })
    .then(result=>{
        res.send(result.deletedCount>0);
    })
 })

})
app.listen(4000, ()=>console.log('Listening on port 4000'))