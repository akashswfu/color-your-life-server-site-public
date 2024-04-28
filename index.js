const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json())

//craftItemDb Akash925




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ib4xmsu.mongodb.net/?retryWrites=true&w=majority`;

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
    
    await client.connect();

    const itemCollection = client.db('itemDB').collection('item');
    const categoryCollection = client.db('itemDB').collection('category');

    // Data Add to the MongoDB

    app.post('/item',async(req,res)=>{
        const newItem = req.body;
        const result = await itemCollection.insertOne(newItem);
        res.send(result);
    })
   

    // dat read on server

    app.get('/item',async(req,res)=>{
        const cursor = itemCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //get speficiate load data

    app.get('/item/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await itemCollection.findOne(query);
        res.send(result);
    })


  

    app.get('/emailItem',async(req,res)=>{
        const cursor = itemCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/emailItem/:email',async(req,res)=>{
       
        const email = req.params.email;
        const result = await itemCollection.find({email:email }).toArray();
        res.send(result);

    })

    

























    //data get by subcategory
    app.get('/allCategory',async(req,res)=>{
        const cursor = itemCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/allCategory/:subcategory',async(req,res)=>{
        
        const result = await itemCollection.find({subcategory:req.params.subcategory}).toArray();
        res.send(result);
    })
    

    //update a item

    app.put('/item/:id',async(req,res)=>{
        const id = req.params.id;
        const updateItem = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert:true};
        const item = {
            $set:{
                name:updateItem.name,
                subcategory:updateItem.subcategory,
                description:updateItem.description,
                price:updateItem.price,
                rating:updateItem.rating,
                customization:updateItem.customization,
                processing:updateItem.processing,
                image:updateItem.image,
                email:updateItem.email,
                displayName:updateItem.displayName,
                stock:updateItem.stock
            }
        }
        const result = await itemCollection.updateOne(filter,item,options);
        res.send(result);
    })
    

    // delete data

    app.delete('/item/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result =await itemCollection.deleteOne(query);
        res.send(result);

    })
    
    //category start here

    app.post('/category',async(req,res)=>{
        const newItem = req.body;
        const result = await categoryCollection.insertOne(newItem);
        res.send(result);

    })

    app.get('/category',async(req,res)=>{
        const cursor = categoryCollection.find();
        const result = await cursor.toArray();
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


app.get('/',(req,res)=>{
    res.send("Item Server is running")
})

app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
})