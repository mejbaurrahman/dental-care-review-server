const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.twtll.mongodb.net/?retryWrites=true&w=majority`;



// const { MongoClient} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        // client.connect();
        console.log('Connected successfully');
        const servicesCollection = client.db('dentalCare').collection('services');
        
        app.get('/hservices', async (req, res)=>{
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        })
        app.get('/service/:id', async (req, res)=>{
           
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const cursor =await servicesCollection.findOne(query);
            res.json(cursor);
        })
        app.get('/services', async (req, res)=>{
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log(service);
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })
    }finally{

    }
}

run().catch(()=>console.dir);

app.get('/', (req, res)=>{
    res.send("Welcome to Mejba's Dental Center");
})

app.listen(port, ()=>{
    console.log(`listening to port`, port);
})