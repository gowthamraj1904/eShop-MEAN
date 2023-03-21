const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// To upload files
const multer = require('multer');
const { Category } = require('../models/category');
const { Product } = require('../models/product');

const galleryUploadFolder = 'public/uploads';
// To Validate file types
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};
// Change default file name to custom file name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidFile = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid Image type');

        if (isValidFile) {
            uploadError = null;
        }

        cb(uploadError, galleryUploadFolder);
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // cb(null, file.fieldname + '-' + uniqueSuffix);

        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

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
    // -_id is exclude the id from the response
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
        const response = {
            status: false,
            message: 'Product is not available'
        };
        res.status(500).json(response);
    }

    res.status(200).send(products);
});

// Add new product
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(400).send('Invalid Category');
    }

    const file = req.file;

    if (!file) {
        return res.status(400).send('No image in the request');
    }

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get(
        'host'
    )}/${galleryUploadFolder}/`;
    const product = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        image: `${basePath}${fileName}`,
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
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product id');
    }

    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(400).send('Invalid Category');
    }

    const isValidProduct = await Product.findById(req.params.id);
    if (!isValidProduct) {
        return res.status(400).send('Invalid Product');
    }

    const file = req.file;
    let imagePath;

    if (file) {
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get(
            'host'
        )}/${galleryUploadFolder}/`;

        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = product.image;
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
                const response = {
                    success: true,
                    message: 'The product is deleted'
                };
                return res.status(200).json(response);
            } else {
                const response = {
                    success: false,
                    message: 'Product not found'
                };
                return res.status(404).json(response);
            }
        })
        .catch((err) => {
            const response = {
                success: false,
                error: err
            };
            return res.status(400).json(response);
        });
});

// Get product count
router.get(`/get/count`, async (req, res) => {
    // Get all the count - Product.countDocuments();
    // Get product count with rating is greater then 2
    const productsCount = await Product.countDocuments(
        { rating: { $gt: 2 } },
        { limit: 100 }
    );

    if (!productsCount) {
        const response = {
            status: false,
            message: 'Product is empty'
        };
        res.status(500).json(response);
    }

    res.status(200).send({ productsCount: productsCount });
});

// Get only featured products with custom limit
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const filter = {
        isFeatured: true
    };
    const products = await Product.find(filter).limit(Number(count));

    if (!products) {
        const response = {
            status: false,
            message: 'Product is empty'
        };
        res.status(500).json(response);
    }

    res.status(200).send(products);
});

router.put(
    '/gallery-images/:id',
    uploadOptions.array('image', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product id');
        }

        const files = req.files;
        let imagePaths = [];
        const basePath = `${req.protocol}://${req.get(
            'host'
        )}/${galleryUploadFolder}/`;

        if (files) {
            files.map((file) => {
                imagePaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = {
            images: imagePaths
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
    }
);

module.exports = router;
