import {FirebaseFirestore} from "@firebase/firestore-types";
import {Stock} from '../../core/models/store';

export {};
const express = require('express');
const router = express.Router();

router.post('', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

    // Hopefully this will never fail
    const newStock: Stock = {
        foods: [],
        username: req.user.username
    };
    firestore.collection("stock").add(newStock);

    firestore.collection("users")
        .where("username", "==", req.body.username)
        .get()
        .then(result => {
            console.log(req.body.username)
           if (result.size != 0) {
               res.status(403).send({message: "Username already exists"});
           } else {
               firestore.collection('users').add(req.body).then((ref: any) => {
                   if (ref) {
                       res.status(201).send({username: req.body.username});
                   } else {
                       res.status(500).send({});
                   }

                   next();
               });
           }
        });
}));

router.get('/isloggedin', (req: any, res: any, next: any) => {
    res.status(200).send({"isLoggedIn": req.user != null || req.user != undefined});
});

module.exports = router;
