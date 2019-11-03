import {FirebaseFirestore} from "@firebase/firestore-types";

export {};
const express = require('express');
const router = express.Router();

router.post('', ((req: any, res: any, next: any) => {
    const firestore: FirebaseFirestore = req.firestore;

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

module.exports = router;
