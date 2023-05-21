const express = require("express");
const cors = require("cors")
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xoojudr.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((err)=>{
      if(err){
        console.log(err)
        return;
      }
    });
    // Add Toy
    const toyCollection = client.db('toyStore').collection('toy');
        //All Toys
        app.get('/alltoy', async (req, res) => {
            const cursor = toyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/mytoy/', async(req, res) => {
            let query = {}
            const email = req.query?.email;
            query = {email: email}
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/sortmytoy/', async(req, res) => {
            let query = {}
            const email = req.query?.email;
            const sort = req.query?.sort;
            // console.log(email, sort)
            query = {email: email}
            const result = await toyCollection.find(query).sort({price: sort}).toArray();
            res.send(result);
        })
        app.get('/singletoy/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.findOne(query);
            res.send(result);
        })
        
        app.put('/updatetoy/:id', async(req, res) => {
            const id = req.params.id;
            const toy = req.body;
            console.log(id, toy)
            const query = {_id: new ObjectId(id)}
            const options = {upsert: true}
            const updated = {
              $set:{
                price: toy.price,
                quantity: toy.quantity,
                details: toy.details

              }
            }
            const result = await toyCollection.updateOne(query, updated, options);
            res.send(result);
        })

        app.post('/addtoy', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        })

        app.delete('/deletetoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('Toys are loading')
})

app.listen(port, () =>{
    console.log(`Toys are loading on port: ${port}`)
})