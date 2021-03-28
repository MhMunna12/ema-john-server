const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nwuix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.use(bodyParser.json());
app.use(cors());

const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("EmajohnStore").collection("products");
  const ordersCollection = client.db("EmajohnStore").collection("orders");
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertMany(products)
    .then(result => {
      res.send(result.insertedCount)
      console.log(result);
    })
  })
  app.get('/products',(req,res) =>{
    productsCollection.find({}).limit(10)
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  app.get('/product/:key',(req,res) =>{
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })

  app.post('/productByKeys', (req,res) =>{
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0)
    })
  })

});



app.listen(process.env.PORT ||port)

