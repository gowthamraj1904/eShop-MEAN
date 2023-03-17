const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const { Product } = require('../models/product');
const mongoose = require('mongoose');

// Get all products
router.get(`/`, async (req, res) => {
    // localhost:3000/api/v1/products?categories=1235,98765
    let filter = {
        category: []
    };

    // Filter based on the query params
    if (req.query?.categories) {
        filter.category = req.query?.categories.split(',');
    }

    const products = await Product.find(
        filter.category.length > 0 ? filter : null
    );

    if (!products) {
        res.status(500).json({ status: false });
    }

    res.status(200).send(products);
});

// Get only required fields
router.get(`/get/custom-fields`, async (req, res) => {
    // Get few fields only from the table
    // -_is is exclude the id from the response
    const products = await Product.find().select('name image -_id');

    if (!products) {
        res.status(500).json({ status: false });
    }

    res.status(200).send(products);
});

// Get one product by Id with related collection/table data
router.get(`/:id`, async (req, res) => {
    // populate() - get linked data from other table
    const products = await Product.findById(req.params.id).populate('category');

    if (!products) {
        res.status(500).json({
            status: false,
            message: 'Product is not available'
        });
    }

    res.status(200).send(products);
});

// Add new product
router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(400).send('Invalid Category');
    }

    const product = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        image: req.body.image,
        images: req.body.images,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        countInStock: req.body.countInStock,
        dateCreated: req.body.dateCreated
    };
    let newProduct = new Product(product);

    newProduct = await newProduct.save();

    if (!newProduct) {
        return res.status(500).send('The Product cannot be created');
    }

    res.status(200).send(newProduct);
});

// Update a product
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product id');
    }

    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(400).send('Invalid Category');
    }

    const product = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        image: req.body.image,
        images: req.body.images,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        countInStock: req.body.countInStock,
        dateCreated: req.body.dateCreated
    };
    const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        product,
        { new: true }
    );

    if (!updateProduct) {
        res.status(404).send('The Product cannot be created');
    }

    res.status(200).send(updateProduct);
});

// Delete a product by Id
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'The product is deleted'
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                error: err
            });
        });
});

// Get product count
router.get(`/get/count`, async (req, res) => {
    // Get all the count
    // const productsCount = await Product.countDocuments();
    // Get product count with rating is greater then 2
    const productsCount = await Product.countDocuments(
        { rating: { $gt: 2 } },
        { limit: 100 }
    );

    if (!productsCount) {
        res.status(500).json({
            status: false,
            message: 'Product is empty'
        });
    }

    res.status(200).send({ productsCount: productsCount });
});

// Get only featured products with custom limit
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(
        Number(count)
    );

    if (!products) {
        res.status(500).json({
            status: false,
            message: 'Product is empty'
        });
    }

    res.status(200).send(products);
});

module.exports = router;
