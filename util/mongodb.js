const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

// Store the mongo client
let client;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}


async function connectToDb() {
  // If it exists, return with the database already set
  if (client) {
    return client.db(process.env.MONGODB_DB);
  }
  // Otherwise we need to instantiate the client
  else {
    client = new MongoClient(uri, options);
    client = await client.connect();
    return client.db(process.env.MONGODB_DB);
  }
}



// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default connectToDb;