const { MongoClient } = require("mongodb");
//import dotenv
const dotenv = require("dotenv")

dotenv.config()

let dbConnection;
let uri = process.env.MONGODB_URI

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
