export {};
const express = require('express');
const router = express.Router();
import {FirebaseFirestore} from "@firebase/firestore-types";
import {Stock, StockItem} from "../../core/models/store";
import {DonationItem} from "../../core/models/donation";
import {PurchaseItem} from "../../core/models/purchase";

router.get('/list', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    if (req.user) {
        firestore.collection('stock')
            .where("username", "==", req.user.username)
            .limit(1)
            .get()
            .then((result) => {
                if (result.size != 1) {
                    res.status(404).send({});
                } else {
                    let store: Stock = {
                        foods: result.docs[0].get("foods"),
                        username: req.user.username
                    };

                    res.status(200).send(store);
                    next();
                }
            });
    } else {
        res.sendStatus(403);
        next();
    }
}));

router.post('/donate', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;
    firestore.collection("stock")
        .where("username", "==", req.user.username)
        .limit(1)
        .get()
        .then(result => {
            let foods: StockItem[] = result.docs[0].get("foods");
            let wasEmpty = foods.length == 0;

            req.body.items.forEach((donated: DonationItem) => {
                let found = false;
                foods.forEach((existing: StockItem) => {
                    if (donated.foodName === existing.name) {
                        existing.quantity += donated.quantity;
                        found = true;
                    }
                });

                if (!found) {
                    foods.push({name: donated.foodName, quantity: donated.quantity});
                    console.log(JSON.stringify(donated));
                }
            });

            if (wasEmpty) {
                const stock: Stock = {
                    username: req.user.username,
                    foods: foods
                };

                result.docs[0].ref.set(stock).then((ref: any) => {
                    res.status(200).send({test:"test"});
                    next();
                });
            } else {
                result.docs[0].ref.update("foods", foods).then((ref: any) => {
                    res.status(200).send({test:"test"});
                    next();
                });
            }
        });
}));

router.post('/purchase', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    firestore.collection("stock")
        .where("username", "==", req.user.username)
        .limit(1)
        .get()
        .then(result => {
            let foods: StockItem[] = result.docs[0].get("foods");

            req.body.items.forEach((donated: PurchaseItem) => {
                foods.forEach((existing: StockItem) => {
                    if (donated.foodName === existing.name) {
                        existing.quantity -= donated.quantity;
                    }
                });
            });

            result.docs[0].ref.update("foods", foods).then((ref => {
                res.status(200).send({});
                next();
            }));
        });
}));

module.exports = router;
