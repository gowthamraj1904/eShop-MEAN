const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');

// Get all categories
router.get(`/`, async (req, res) => {
    const categories = await Category.find();

    if (!categories) {
        res.status(500).json({ success: false });
    }

    res.status(200).send(categories);
});

// Get one category by Id
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        const response = {
            success: false,
            message: 'Category is not available'
        };
        res.status(500).json(response);
    }

    res.status(200).send(category);
});

// Add new Category
router.post(`/`, async (req, res) => {
    const category = {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    };
    let newCategory = new Category(category);

    newCategory = await newCategory.save();

    if (!newCategory) {
        res.status(404).send('The Category cannot be created');
    }

    res.status(200).send(newCategory);
});

// Update a category
router.put('/:id', async (req, res) => {
    const category = {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    };

    const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        { new: true }
    );

    if (!updateCategory) {
        res.status(404).send('The Category cannot be created');
    }

    res.status(200).send(updateCategory);
});

// Delete a category by Id
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                const response = {
                    success: true,
                    message: 'The category is deleted'
                };
                return res.status(200).json(response);
            } else {
                const response = {
                    success: false,
                    message: 'Category not found'
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

module.exports = router;
