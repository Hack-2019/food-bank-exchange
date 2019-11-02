import {google} from "googleapis";
import credentials from '../oauth.credentials';

export {};
const express = require('express');
const router = express.Router();

let auth = new google.auth.OAuth2(
    credentials.clientID,
    credentials.secret,
    "localhost:8080"
)

const oauthScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email'
];

router.get('/login/redirect', ((req: any, res: any, next: any) => {
    res.send(auth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: oauthScope
    }));

    next();
}));

module.exports = router;
