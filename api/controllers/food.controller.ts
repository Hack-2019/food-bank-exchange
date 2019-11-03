import {FirebaseFirestore} from "@firebase/firestore-types";
import {FoodTag} from '../../core/models/food.tag';
import {Food} from '../../core/models/food';

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

router.get('/list', (((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    firestore.collection("foods")
        .limit(1000000000)
        .get()
        .then((result => {
            const entries: Food[] = result.docs.map(d => <Food>{name: d.get("name"), tags: d.get("tags")});
            res.status(200).send(entries);
            next();
        }));
})));

module.exports = router;
