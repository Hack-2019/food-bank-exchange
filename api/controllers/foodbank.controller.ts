export {};
const express = require('express');
const router = express.Router();

router.get('/test', ((req: any, res: any, next: any) => {
    res.send("hello world!");
}));

module.exports = router;
