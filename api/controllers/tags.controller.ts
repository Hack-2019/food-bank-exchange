import {FirebaseFirestore} from "@firebase/firestore-types";

export {};
const express = require('express');
const router = express.Router();

router.get('/add', (((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;
    firestore.collection()
})));

router.get('/list', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;
    firestore.collection('tags')
        .
}));

module.exports = router;
