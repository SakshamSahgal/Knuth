const { MongoClient, ServerApiVersion } = require('mongodb'); //including the mongoDB package

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  async function readDB(Database, Collection, Query) {
      try {
        await client.connect();
        const db = client.db(Database);
        const collection = db.collection(Collection);
        
        const result = await collection.find(Query).toArray();
        
        return result;
      } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the caller to handle
      } finally {
        await client.close();
      }
    }

    async function writeDB(Database, Collection, Data) {
        try {
          await client.connect();
          const db = client.db(Database);
          const collection = db.collection(Collection);
          
          const result = await collection.insertOne(Data);

          return result;
        } catch (error) {
          console.error("Error:", error);
          throw error; // Rethrow the error for the caller to handle
        } finally {
          await client.close();
        }
      }
      

module.exports = {readDB,writeDB};