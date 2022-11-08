const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());



const { MongoClient} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run (){
    try{
        client.connect();
        const services = client.db('dentalCare').collection('services');
        app.post('/services', async(req, res)=>{
            const service = req.body;
        })
    }catch{

    }
}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("Welcome to Mejba's Dental Center");
})

app.listen(port, ()=>{
    console.log(`listening to port`, port);
})