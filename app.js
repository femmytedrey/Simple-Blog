const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

//init app and middleware
const app = express();
app.use(express.json());

//db Connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
    db = getDb();
  }
});

//routes
app.get("/books", (req, res) => {
  //pagination
  const page = req.query.p || 1;
  const bookPerPage = 2;
  // so when it comes to pagination, we can make use of 2 methods namely: skip and limit

  let books = [];
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip((page - 1) * bookPerPage)
    .limit(bookPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch collection" });
    });
});

//fetching single book
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "error fetching book" });
      });
  } else {
    res.status(500).json({ error: "this is not a valid id" });
  }
});

//post request
app.post("/books", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not create this document" });
    });
});

//delete request
app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        res.status(204).json(result);
      })
      .catch(() => {
        res.status(400).json({ error: "could not delete document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid id" });
  }
});

//update requeest
app.patch("/books/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  if (ObjectId.isValid(id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "could not update the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid id" });
  }
});
