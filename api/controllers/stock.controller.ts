export {};
const express = require('express');
const router = express.Router();
import {FirebaseFirestore} from "@firebase/firestore-types";
import {Stock, StockItem} from "../../core/models/store";
import {Donation, DonationItem} from "../../core/models/donation";

router.get('/list', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    if (req.user) {
        firestore.collection('stock')
            .where("username", "==", 'test')
            .limit(1)
            .get()
            .then((result) => {
                if (result.size != 1) {
                    res.sendStatus(404);
                } else {
                    let store: Stock = {
                        foods: result.docs[0].get("foods"),
                        username: req.user.username
                    };

                    res.status(200).send(store);
                }
            });
    } else {
        res.sendStatus(403);
    }
}));

router.post('/donate', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    firestore.collection("stock")
        .where("username", "==", req.user.username)
        .limit(1)
        .get()
        .then(result => {
            let stock: Stock = result.docs[0].get("foods");

            req.items.forEach((donated: DonationItem) => {
                stock.foods.forEach((existing: StockItem) => {
                    if (donated.foodName === existing.name) {
                        existing.quantity += donated.quantity;
                    }
                });
            });

            firestore.doc(result.docs[0].id).update("foods", stock);
        });
}));

module.exports = router;
