import express = require('express');
import { MongoClient } from "mongodb";
const { Firestore } = require("@google-cloud/firestore");

const cors = require("cors");
const API_PORT = 8080;

const firestore = new Firestore({projectId: "foodbankexchange", keyFilename: 'gcloud-credentials.json'});

// Create a new express application instance
const app: express.Application = express();

// Database initialization routine
const initializeDatabase = (callback: (err: any) => void) => {
    console.group('Initializing application database');
    console.log(`Connecting to ${MONGO_SERVER}...`);
    MongoClient.connect(MONGO_SERVER, { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.error(`Failed to connect to server ${MONGO_SERVER}.`, err);
            console.groupEnd();
            callback(true);
            return;
        }

        console.log(`Connected to ${MONGO_SERVER}.`);
        console.log(`Selecting database ${MONGO_DATABASE}.`);
        db = client.db(MONGO_DATABASE);

        const collectionsToCheck = [ 'foodbanks' ];
        console.group(`Checking for collections: ` + JSON.stringify(collectionsToCheck));
        db.listCollections({}, { nameOnly: true }).toArray()
            .then((cols: any) => {
                collectionsToCheck.forEach(collectionToCheck => {
                    if (!cols.some((col: any) => col.name === collectionToCheck)) {
                        console.log(`Creating ${collectionToCheck}...`);
                        db.createCollection(collectionToCheck)
                            .then(() => console.log(`Collection ${collectionToCheck} created.`));
                    }
                });

                console.log('Collections validated.');
                console.groupEnd();
                console.groupEnd();

                callback(false);
            });
    });
};

// Allow for processing of POSTed JSON into request.body
app.use(express.json());

// Allow requests from other domains
app.use(cors());

// Middleware for request timing and debug
app.use((req: any, res: any, next: any) => {
    console.group(`Handling request at ${new Date().toLocaleTimeString()} for ${req.url}...`);
    req.startedAt = new Date();
    req.db = db;
    next();
});

// Register API endpoints
const foodbanksController = require('./controllers/foodbank.controller');
app.use('/foodbanks', foodbanksController);

// Middleware for request debug of timing
app.use((req: any, res: any, next: any) => {
    const secondsToProcess = (new Date().getTime() - req.startedAt.getTime()) / 1000;
    console.log(`Request completed with code ${res.statusCode} in ${secondsToProcess} seconds.`);
    console.groupEnd();
    next();
});

// Initialize database, and open server listener
initializeDatabase((err) => {
    if(!err) {
        app.listen(API_PORT, function () {
            console.log(`API web service started on port ${API_PORT}.`);
        });
    }
});
