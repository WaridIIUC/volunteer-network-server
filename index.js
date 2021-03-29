const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config()
//console.log(process.env.DB_PASS);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ishda.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volunteer").collection("events");
  console.log("database");

  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log("add", newEvent);
    eventsCollection.insertOne(newEvent)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })

  app.get("/events", (req, res) => {
    eventsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.delete("/deleteEvent/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log("delete this", id);
    eventsCollection.deleteOne({ _id: id })
    .then(result => {
      res.send(result.deletedCount > 0);
    })

  })

});


app.listen(port)