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
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Add Toy
    const toyCollection = client.db('toyStore').collection('toy');
        //All Toys
        app.get('/alltoy', async (req, res) => {
            const cursor = toyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })

        // app.get('/mytoy/', async(req, res) => {
        //     let query = {}
        //     const email = req.query?.email;
        //     // console.log(email)
        //     query = {email: email}
        //     const result = await toyCollection.find(query).toArray();
        //     res.send(result);
        // })
        // app.get('/singletoy/:id', async(req, res) => {
        //     const id = req.params.id;
        //     // console.log(email)
        //     const query = {_id: new ObjectId(id)}
        //     const result = await toyCollection.findOne(query);
        //     res.send(result);
        // })
        app.put('/updatetoy/:id', async(req, res) => {
            const id = req.params.id;
            const toy = req.body;
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

        // app.put('/coffee/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const filter = {_id: new ObjectId(id)}
        //     const options = { upsert: true };
        //     const updatedCoffee = req.body;

        //     const coffee = {
        //         $set: {
        //             name: updatedCoffee.name, 
        //             quantity: updatedCoffee.quantity, 
        //             supplier: updatedCoffee.supplier, 
        //             taste: updatedCoffee.taste, 
        //             category: updatedCoffee.category, 
        //             details: updatedCoffee.details, 
        //             photo: updatedCoffee.photo
        //         }
        //     }

        //     const result = await coffeeCollection.updateOne(filter, coffee, options);
        //     res.send(result);
        // })

        // app.delete('/coffee/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await coffeeCollection.deleteOne(query);
        //     res.send(result);
        // })


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