const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');

router.get(`/`, (req, res) => {
    Category.find()
        .then((categories) => {
            res.status(200).send(categories);
        })
        .catch((error) => {
            const response = {
                message: 'Categories are not available',
                error
            };
            res.status(400).json(response);
        });
});

router.get('/:id', (req, res) => {
    Category.findById(req.params.id)
        .then((category) => {
            res.status(200).send(category);
        })
        .catch((error) => {
            const response = {
                message: 'Category is not available',
                error
            };
            res.status(400).json(response);
        });
});

router.post(`/`, (req, res) => {
    const category = {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    };
    let newCategory = new Category(category);

    newCategory
        .save()
        .then((category) => {
            res.status(200).send(category);
        })
        .catch((error) => {
            const response = {
                message: 'The Category cannot be created',
                error
            };
            res.status(400).json(response);
        });
});

router.put('/:id', (req, res) => {
    const category = {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    };

    Category.findByIdAndUpdate(req.params.id, category, { new: true })
        .then((category) => {
            res.status(200).send(category);
        })
        .catch((error) => {
            const response = {
                message: 'The Category cannot be updated',
                error
            };
            res.status(400).json(response);
        });
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                const response = {
                    message: 'The category is deleted'
                };
                res.status(200).json(response);
            } else {
                const response = {
                    message: 'Category not found'
                };
                res.status(404).json(response);
            }
        })
        .catch((error) => {
            const response = {
                message: 'The category is not deleted',
                error
            };
            res.status(400).json(response);
        });
});

module.exports = router;
