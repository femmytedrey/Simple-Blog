const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//const { identity } = require("lodash");
const blogRoutes = require("./views/routes/blogRoutes");
dotenv.config();

//express app
const app = express();

// connect to mongodb
const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((error) => console.log(error));

// register view engine
app.set("view engine", "ejs");

//middleware & static files
app.use(express.static("public"));

// third party middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  //   res.sendFile("./view/about.html", { root: __dirname });
  // res.send("<p>Welcome to about page</p>");

  res.render("about", { title: "About" });
});

//blog routes
app.use('/blogs', blogRoutes);

//404 page
app.use((req, res) => {
  //   res.status(404).sendFile("./view/404.html", { root: __dirname });
  res.status(404).render("404", { title: "404" });
});
