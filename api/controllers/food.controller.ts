import {FirebaseFirestore} from "@firebase/firestore-types";
import {FoodTag} from '../../core/models/food.tag';
import {Food} from '../../core/models/food';
import { getImage } from "../api/image-api";
import {UpcSearch, UpcSearchResult} from '../../core/models/upc.search';

export {};
const express = require('express');
const router = express.Router();

router.post('/add', ((async (req: any, res: any, next: any) => {
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

    req.body.url = await getImage(req.body.name);

    firestore.collection('foods')
        .where("name", "==", req.body.name)
        .get()
        .then(result => {
            if (result.size == 0) {
                firestore.collection("foods").add(req.body).then(ref => {
                    if (ref) {
                        res.status(201).send({});
                        next();
                    } else {
                        res.status(500).send({});
                        next();
                    }
                });
            } else {
                res.status(403).send({});
                next();
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

router.post("/search/upc", ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    const search: UpcSearch = req.body;
    firestore.collection("foods")
        .where("upc", "==", search.upc)
        .limit(1)
        .get()
        .then((results) => {
            let productName: string;
            if (results.size > 0) {
                productName = res.docs[0].get("name");
            }

            res.status(200).send(<UpcSearchResult>{upc: search.upc, productName: name});
        })
}));

module.exports = router;
