import {FirebaseFirestore} from "@firebase/firestore-types";

export {};
const express = require('express');
const router = express.Router();

router.post('', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    firestore.collection('users').add(req.body).then((ref: any) => {
        if (ref) {
            res.sendStatus(201);
        } else {
            res.sendStatus(500);
        }

        next();
    });
}));

module.exports = router;
