const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.port || 5000

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.PASS_KEY}@cluster0.0db2mvq.mongodb.net/?retryWrites=true&w=majority`;

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
        const siteCollection = client.db('productsDB').collection('site')
        const brandCollection = client.db('productsDB').collection('brand')
        const productCollection = client.db('productsDB').collection('product')
        const userCollection = client.db('productsDB').collection('user')
        const cartCollection = client.db('productsDB').collection('cart')


        // brand collection goes here =================
        app.get('/site', async (req, res) => {
            const cursor = siteCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.post('/site', async (req, res) => {
            const site = req.body
            console.log(site)
            const result = await siteCollection.insertOne(site)
            res.send(result)

        })


        // brand collection goes here =================
        app.get('/brands', async (req, res) => {
            const cursor = brandCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.post('/brands', async (req, res) => {
            const brand = req.body
            console.log(brand)
            const result = await brandCollection.insertOne(brand)
            res.send(result)

        })

        // product collection goes here =================
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)

        })

        app.get('/products/brand/:brandName', async (req, res) => {
            const brandName = req.params.brandName;
            const query = { brandName: brandName };
            const results = await productCollection.find(query).toArray();
            res.send(results);
        });

        app.post('/products', async (req, res) => {
            const product = req.body
            console.log(product)
            const result = await productCollection.insertOne(product)
            res.send(result)

        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedProduct = req.body
            const product = {
                $set: {
                    name: updatedProduct.name,
                    brandName: updatedProduct.brandName,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    description: updatedProduct.description,
                    image: updatedProduct.image
                }
            }
            const result = await productCollection.updateOne(query, product, options)
            res.send(result)
        })

        // users crud functionalities =================
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.post('/cart', async (req, res) => {
            const cart = req.body
            console.log(cart)
            const result = await cartCollection.insertOne(cart)
            res.send(result)

        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
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


app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(port, (req, res) => {
    console.log('express is running')
})