const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}

async function run (){
    try{
        console.log('Connected successfully');
        const servicesCollection = client.db('dentalCare').collection('services');
        const reviewsCollection = client.db('dentalCare').collection('reviews');
        app.post('/jwt', (req, res) =>{
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
            res.send({token})
        }) 
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
        app.get('/reviews',verifyJWT, async (req, res)=>{
           
            const decoded= req.decoded;
            if(decoded.email !== req.query.email){
                res.status(403).send({message: 'unauthorized access'})
            }
            let query={};
            
            const emailQuery = req.query.email;
            
            if(emailQuery){
                query = {email: req.query.email};
            }
            console.log(query);
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        app.get('/serviceReviews', async (req, res)=>{
            let query = {};
            const serviceR = req.query.serviceId;
           
            if(serviceR){
                query = {
                    serviceId: req.query.serviceId
                }
            }
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);

        })
        app.get('/services', async (req, res)=>{
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/services', async(req, res)=>{
            const service = req.body;

            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })
        app.post('/reviews', async(req, res)=>{
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.json(result)
        })
        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body.review;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                    review: review
                }
            }
            const result = await reviewsCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
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