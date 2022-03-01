const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

async function connectToDb() {
  if (client) {
    return client.db("cradlepoint");
  }
  else {
    client = new MongoClient(uri, options);
    client = await client.connect();
    return client.db("cradlepoint");
  }
}



// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default connectToDb;