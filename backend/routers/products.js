const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');

router.get(`/`, async (req, res) => {
    const products = await Product.find();

    if (!products) {
        res.status(500).json({ status: false });
    }

    res.send(products);
});

router.post(`/`, (req, res) => {
    const product = {
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    };
    const newProduct = new Product(product);

    newProduct
        .save()
        .then((createdProduct) => {
            res.status(201).json(createdProduct);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                success: false
            });
        });
});

module.exports = router;
