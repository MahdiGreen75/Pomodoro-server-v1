const express = require("express");
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

//mongodb (CRUD) oparation goes here.

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.geunt7i.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.geunt7i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const usersCollection = client.db("pomodoroDB").collection("pomodoroUser");

        app.post("/api/v1/uesr/session-list", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.patch("/api/v1/uesr/session-list-update", async (req, res) => {
            const user = req.body;
            const filter = { _id: new ObjectId(user.id) };
            const updateDoc = {
                $set: {
                    isSessionCompleted: true
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("POMODORO server is runnign");
})

app.listen(port, () => {
    console.log(`POMODORO server is running on port, ${port}`);
})