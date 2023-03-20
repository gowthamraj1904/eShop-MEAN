const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');

router.get(`/`, async (req, res) => {
    const orders = await Order.find();

    if (!orders) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(orders);
});

module.exports = router;
