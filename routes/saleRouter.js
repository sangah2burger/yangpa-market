const express = require('express');
const {Sale} = require('../models');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECTRET;

const upload = require('./uploadImage');

router.post('/', upload.single('image'), async(req, res)=> {
    const newSale = req.body;
    newSale.photo = req.filename;
    newSale.userID = req.userID;
    try {
        const result = await Sale.create(newSale)
        res.json({ success: true, documents: [result], message: '판매 상품 등록 성공'});
    } catch (err) {
        res.json({ success: false, documents: [], message: err.message });
        console.log(err)
    }
});

router.get('/', async (req, res)=> {
    const result = await Sale.findAll();
    res.json({ success: true, documents: result, message: '판매 상품 조회 성공'});
});

router.get('/:id', async(req, res)=> {
    const id = req.params.id
    const options = {
        where : {
            id : id
        }
    };
    const result = await Sale.findAll(options);
    res.json({ success: true, documents: result, message: '판매 상품 조회 성공'});
});

module.exports = router;