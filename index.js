const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

const port = 9000;
// mongo database
const uri =
  "mongodb+srv://sujanathapa:sujana@cluster0.akm2dix.mongodb.net/clothes?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });
//connect to mongodb
async function run() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// get all the clothes
app.get("/clothes", async (req, res) => {
  const collection = client.db("clothes").collection("clothes");

  const clothes = await collection.find().toArray();

  res.status(200).json(clothes);
});

// add clothes in the list
app.post("/clothes/add", async (req, res) => {
  const clothes = client.db("clothes").collection("clothes");
  const { price, size, gender, fabric } = req.body;

  const clothe = await clothes.insertOne({
    price,
    size,
    gender,
    fabric,
  });

  res.status(201).json({ message: "New cloth has released", clothe });
});

//get single cloth by id
app.get("/clothes/:id", async (req, res) => {
  const clothes = client.db("clothes").collection("clothes");
  const { id } = req.params;

  const cloth = await clothes.findOne({ _id: new ObjectId(id) });
  res.status(200).json(cloth);
});

// update clothes using id
app.put("/clothes/:id", async (req, res) => {
  const clothes = client.db("clothes").collection("clothes");
  const { id } = req.params;
  const updateCloth = req.body;

  const cloth = await clothes.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateCloth }
  );

  res.status(200).json({ message: "Cloth has been updated.", cloth });
});

// delete cloth using id
app.delete("/cloth/:id", async (req, res) => {
  const clothes = client.db("cloth").collection("clothes");
  const { id } = req.params;

  await clothes.deleteOne({ _id: new ObjectId(id) });
  res.status(200).json("Cloth has been deleted.");
});

run().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});
