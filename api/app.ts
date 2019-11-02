import express = require('express');
import {FirebaseFirestore} from "@firebase/firestore-types";
const { Firestore } = require("@google-cloud/firestore");
import { LoginResult } from "../core/models/authentication/login.result"

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
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

const tagsController = require('./controllers/tags.controller');
app.use('/tags', tagsController);

const registerController = require('./controllers/register.controller');
app.use('/register', registerController);

const foodController = require('./controllers/food.controller');
app.use('/food', foodController);

// Setup middleware for password
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'nothing in the world'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username: string, password: string, done: any) {
        firestore.collection('users')
            .where("username", "==", username)
            .get()
            .then(result => {
                if (result.size != 1) {
                    return done(null, false, { message: "multiple users with the same username" });
                }

                if (result.docs[0].get("password") == password) {
                    return done(null, result.docs[0].data());
                } else {
                    return done(null, false, { message: "incorrect password" });
                }
            });
    }
));

app.post('/login', (req: any, res: any, next: any) => {
    passport.authenticate("local", function(err: any, user: any, info: any) {
        if (!user || err) {
            res.sendStatus(403);
        } else {
            req.login(user, (err: any) => {
                if (!err) {
                    let response: LoginResult = new LoginResult(user.username);
                    res.status(200).send(response);
                }
            });
        }
    })(req, res, next);
});

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});

// Initialize database, and open server listener
app.listen(API_PORT, function () {
    console.log(`API web service started on port ${API_PORT}.`);
});
