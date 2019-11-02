import {google} from "googleapis";
import credentials from '../oauth.credentials';

export {};
const express = require('express');
const router = express.Router();

const oauthScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email'
];

router.get('', ((req: any, res: any, next: any) => {
    const auth = new google.auth.OAuth2(
        credentials.clientID,
        credentials.secret,
        req.protocol + "://" + req.get('host')
    );

    res.send(auth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: oauthScope
    }));

    next();
}));

module.exports = router;
