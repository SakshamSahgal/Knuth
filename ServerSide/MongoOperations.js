const { MongoClient, ServerApiVersion } = require('mongodb'); //including the mongoDB package

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true, //generate errors when deprecated MongoDB features are used
    }
});


async function writeDB(Database, Collection, Data) { //Create Entry
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

async function readDB(Database, Collection, Query) { //Read Entry
    try {
        await client.connect();
        const db = client.db(Database);
        const collection = db.collection(Collection);

        const result = await collection.find(Query).toArray();

        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

async function updateDB(Database, Collection, FindQuery, UpdateQuery) { //Update Entry
    try {
        await client.connect();
        const db = client.db(Database);
        const collection = db.collection(Collection);

        const result = await collection.updateOne(FindQuery,UpdateQuery);

        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

async function deleteDB(Database, Collection, Query) { //Delete Entry
    try {
        await client.connect();
        const db = client.db(Database);
        const collection = db.collection(Collection);

        const result = await collection.deleteMany(Query);

        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

async function countDocuments(Database, Collection, Query) { //Count Entries
    try {
        await client.connect();
        const db = client.db(Database);
        const collection = db.collection(Collection);

        const result = await collection.countDocuments(Query);

        return result;

    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

async function SkipRead(Database, Collection, Query, Skip, Limit) { //Read Entry
    try {
        await client.connect();
        const db = client.db(Database);
        const collection = db.collection(Collection);

        const result = await collection.find(Query).skip(Skip).limit(Limit).toArray();

        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

module.exports = {writeDB, readDB, updateDB, deleteDB, countDocuments, SkipRead};