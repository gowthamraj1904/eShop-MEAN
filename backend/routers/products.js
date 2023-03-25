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
    destination: (req, file, cb) => {
        const isValidFile = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid Image type');

        if (isValidFile) {
            uploadError = null;
        }

        cb(uploadError, galleryUploadFolder);
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // cb(null, file.fieldname + '-' + uniqueSuffix);

        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, (req, res) => {
    let filter = {
        category: []
    };

    // Filter based on the query params
    if (req.query?.categories) {
        filter.category = req.query?.categories.split(',');
    }

    Product.find(filter.category.length > 0 ? filter : null)
        .populate('category')
        .then((products) => {
            res.status(200).send(products);
        })
        .catch((error) => {
            const response = {
                message: 'Products are empty',
                error
            };
            res.status(400).json(response);
        });
});

// Get only required fields
router.get(`/get/custom-fields`, (req, res) => {
    // Get few fields only from the table
    // -_id is exclude the id from the response
    Product.find()
        .select('name image -_id')
        .then((products) => {
            res.status(200).send(products);
        })
        .catch((error) => {
            const response = {
                message: 'Products are empty',
                error
            };
            res.status(400).json(response);
        });
});

// Get one product by Id with related collection/table data
router.get(`/:id`, (req, res) => {
    // populate() - get linked data from other table
    Product.findById(req.params.id)
        .populate('category')
        .then((product) => {
            res.status(200).send(product);
        })
        .catch((error) => {
            const response = {
                message: 'Product is not available',
                error
            };
            res.status(400).json(response);
        });
});

// Add new product
router.post(`/`, uploadOptions.single('image'), (req, res) => {
    Category.findById(req.body.category)
        .then((category) => {
            const file = req.file;

            if (!file) {
                const response = {
                    message: 'No image in the request',
                    error
                };
                res.status(400).json(response);
                return;
            }

            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/${galleryUploadFolder}/`;
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

            newProduct
                .save()
                .then((product) => {
                    res.status(200).send(product);
                })
                .catch((error) => {
                    const response = {
                        message: 'The Product cannot be created',
                        error
                    };
                    res.status(400).json(response);
                });
        })
        .catch((error) => {
            const response = {
                message: 'Invalid Category',
                error
            };
            res.status(400).json(response);
        });
});

// Update a product
router.put('/:id', uploadOptions.single('image'), (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        const response = {
            message: 'Invalid Product id'
        };
        res.status(400).json(response);
        return;
    }

    Category.findById(req.body.category)
        .then((category) => {
            Product.findById(req.params.id)
                .then((isValidProduct) => {
                    const file = req.file;
                    let imagePath;

                    if (file) {
                        const fileName = req.file.filename;
                        const basePath = `${req.protocol}://${req.get('host')}/${galleryUploadFolder}/`;

                        imagePath = `${basePath}${fileName}`;
                    } else {
                        imagePath = req.body.image;
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

                    Product.findByIdAndUpdate(req.params.id, product, { new: true })
                        .then((updatedProduct) => {
                            res.status(200).send(updatedProduct);
                        })
                        .catch((error) => {
                            const response = {
                                message: 'The Product cannot be created',
                                error
                            };
                            res.status(400).json(response);
                        });
                })
                .catch((error) => {
                    const response = {
                        message: 'Invalid Product',
                        error
                    };
                    res.status(400).json(response);
                });
        })
        .catch((error) => {
            const response = {
                message: 'Invalid Category',
                error
            };
            res.status(400).json(response);
        });
});

// Delete a product by Id
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                const response = {
                    message: 'The product is deleted'
                };
                res.status(200).json(response);
            } else {
                const response = {
                    message: 'Product not found'
                };
                res.status(400).json(response);
            }
        })
        .catch((error) => {
            const response = {
                message: 'The product is not deleted',
                error
            };
            res.status(400).json(response);
        });
});

// Get product count
router.get(`/get/count`, (req, res) => {
    // Get all the count - Product.countDocuments();
    // Get product count with rating is greater then 2
    // const productsCount = await Product.countDocuments(
    //     { rating: { $gt: 2 } },
    //     { limit: 100 }
    // );
    Product.countDocuments()
        .then((productsCount) => {
            res.status(200).send({ productsCount });
        })
        .catch((error) => {
            const response = {
                message: 'Product is empty',
                error
            };
            res.status(400).json(response);
        });
});

// Get only featured products with custom limit
router.get(`/get/featured/:count`, (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const filter = {
        isFeatured: true
    };

    Product.find(filter)
        .limit(Number(count))
        .then((products) => {
            res.status(200).send(products);
        })
        .catch((error) => {
            const response = {
                message: 'Product is empty',
                error
            };
            res.status(400).json(response);
        });
});

router.put('/gallery-images/:id', uploadOptions.array('image', 10), (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        const response = {
            message: 'Invalid Product id'
        };
        return res.status(400).json(response);
    }

    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/${galleryUploadFolder}/`;

    if (files) {
        files.map((file) => {
            imagePaths.push(`${basePath}${file.filename}`);
        });
    }

    const product = {
        images: imagePaths
    };

    Product.findByIdAndUpdate(req.params.id, product, { new: true })
        .then((updatedProduct) => {
            res.status(200).send(updatedProduct);
        })
        .catch((error) => {
            const response = {
                message: 'The Product cannot be created',
                error
            };
            res.status(400).json(response);
        });
});

module.exports = router;
