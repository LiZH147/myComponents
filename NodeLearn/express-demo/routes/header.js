import express from 'express';

const router = express.Router();

router.get('/response/get/header', (req, res) => {
    res.json(req.header);
})

router.get('/response/gset/header', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.set('token', '123456');
    res.send('<h1>Hello World</h1>');
})

export default router
