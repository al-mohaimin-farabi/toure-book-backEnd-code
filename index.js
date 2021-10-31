const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jlnis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = await client.db("TravelGuid");
    const servicesCollection = await database.collection("travelservices");
    const orderCollection = await database.collection("orders");

    //  POST Api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api");
      const result = await servicesCollection.insertOne(service);
      //   console.log(result);
      res.send(result);
    });

    // orders api
    app.post("/orders", async (req, res) => {
      const service = req.body;
      console.log("hit the post apiii", service);
      const result = await orderCollection.insertOne(service);
      //   console.log(result);
      res.send(result);
    });

    // order get
    app.get("/orders", async (req, res) => {
      const search = req.query.search;
      const cursor = orderCollection.find({});
      const services = await cursor.toArray();
      if (search) {
        const searchResult = services.filter((service) =>
          service.Email.toLocaleLowerCase().includes(search)
        );
        res.send(searchResult);
      } else {
        res.send(services);
      }
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    //   GET Api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //   Delete Api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello World");
});

app.listen(port, () => {
  console.log("Running genius server on port ", port);
});
