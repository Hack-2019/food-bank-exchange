import express = require('express');
import {FirebaseFirestore} from "@firebase/firestore-types";
const { Firestore } = require("@google-cloud/firestore");

const cors = require("cors");
const API_PORT = 8080;

const firestore: FirebaseFirestore = new Firestore({projectId: "foodbankexchange", keyFilename: 'gcloud-credentials.json'});

// Create a new express application instance
const app: express.Application = express();

// Allow for processing of POSTed JSON into request.body
app.use(express.json());

// Allow requests from other domains
app.use(cors());

// Middleware for request timing and debug
app.use((req: any, res: any, next: any) => {
    console.group(`Handling request at ${new Date().toLocaleTimeString()} for ${req.url}...`);
    req.startedAt = new Date();
    req.firestore = firestore;
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

// Setup middleware for password
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username: string, password: string, done: any) {
        console.log(username);

        firestore.collection('users')
            .where("username", "==", username)
            .get()
            .then(result => {
                if (result.size != 1) {
                    done(null, false, { message: "multiple users with the same username" });
                }

                if (result.docs[0].get("password") == password) {
                    done(null, result.docs[0].data())
                }

                done(null, false, { message: "incorrect password" });
            });
    }
));

// Setup login endpoint
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

// Initialize database, and open server listener
app.listen(API_PORT, function () {
    console.log(`API web service started on port ${API_PORT}.`);
});
