/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/
const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://kpramudi2002:pramudi2002@cluster0.14j6u.mongodb.net/ads";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database you want to use
    const db = client.db('ads');

    // Log a success message
    console.log("Successfully connected to the database!");

    // Perform operations on the database here
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}

run();
