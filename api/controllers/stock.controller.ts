export {};
const express = require('express');
const router = express.Router();
import {FirebaseFirestore} from "@firebase/firestore-types";
import {Stock} from "../../core/models/store";

router.post('/list', ((req: any, res: any, next: any) => {
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

module.exports = router;
