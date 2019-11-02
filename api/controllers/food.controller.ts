import {FirebaseFirestore} from "@firebase/firestore-types";
import {FoodTag} from '../../core/models/food.tag';

export {};
const express = require('express');
const router = express.Router();

router.post('/add', (((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    req.body.tags.forEach((tag: string) => {
         firestore.collection('tags')
             .where("name", "==", tag)
             .get()
             .then(result => {
                 if (result.size == 0) {
                     firestore.collection('tags').add(<FoodTag>{name: tag});
                 }
             });
    });

    firestore.collection('foods')
        .where("name", "==", req.body.name)
        .get()
        .then(result => {
            if (result.size == 0) {
                firestore.collection("foods").add(req.body).then(ref => {
                    if (ref) {
                        res.sendStatus(201);
                    } else {
                        res.sendStatus(500);
                    }
                });
            } else {
                res.sendStatus(403);
            }
        });
})));

module.exports = router;
