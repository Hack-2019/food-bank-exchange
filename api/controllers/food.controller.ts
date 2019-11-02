import {FirebaseFirestore} from "@firebase/firestore-types";
import {Food} from '../../core/models/food';

export {};
const express = require('express');
const router = express.Router();

router.get('/add', (((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    req.body.forEach((food: Food) => {
       firestore.collection('tags')
           .
    });

    firestore.collection('tags')
        .add(req.body)
        .then(ref => {
                if (ref) {
                    res.status(200).send(ref);
                } else {
                    res.sendStatus(500);
                }

                next();
            }
        );
})));

module.exports = router;
