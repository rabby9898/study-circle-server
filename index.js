const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qczjssr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const assignmentsCollection = client
      .db("createdAssignmentsDB")
      .collection("assignments");

    const submitCollection = client
      .db("createdAssignmentsDB")
      .collection("submit");

    app.post("/assignments", async (req, res) => {
      const assignments = req.body;
      const result = await assignmentsCollection.insertOne(assignments);
      res.send(result);
    });

    // submitted assignments
    app.post("/submit", async (req, res) => {
      const submits = req.body;
      const result = await submitCollection.insertOne(submits);
      res.send(result);
    });

    app.get("/assignments", async (req, res) => {
      const cursor = assignmentsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/assignments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });

    app.put("/assignments/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAssignment = req.body;

      const assignments = {
        $set: {
          imgUrl: updateAssignment.imgUrl,
          title: updateAssignment.title,
          marks: updateAssignment.marks,
          description: updateAssignment.description,
          difficulty: updateAssignment.difficulty,
          date: updateAssignment.date,
        },
      };

      const result = await assignmentsCollection.updateOne(
        filter,
        assignments,
        options
      );
      res.send(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
