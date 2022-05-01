const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p3ee6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');

        app.get('/product', async(req, res)=>{
            console.log('page', req.query)
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let product;
            if(page || size){
                product = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                product = await cursor.toArray();
            }
            res.send(product);
        });

        app.get('/product-count', async(req, res)=>{
            const count = await productCollection.estimatedDocumentCount();
            res.send({count});
        });
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('john is here and waiting for ema!!');
});

app.listen(port, ()=>{
    console.log('John is running on port', port);
});