const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

router.get(`/`, async (req, res) => {
    // Populate - Get user details and the second argument is which fields are required in the Order response
    const orders = await Order.find()
        .populate('user', 'name')
        .sort({ dateOrdered: -1 });

    if (!orders) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(orders);
    return;
});

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name',
                populate: 'category'
            }
        });

    if (!order) {
        const response = {
            success: false,
            message: 'Order is not available'
        };
        res.status(500).json(response);
    }

    res.status(200).send(order);
});

router.post(`/`, async (req, res) => {
    const orderItemsIds = Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });

            newOrderItem = await newOrderItem.save();
            return newOrderItem.id;
        })
    );

    const orderItemsIdsResolved = await orderItemsIds;
    const totalPrices = await Promise.all(
        orderItemsIdsResolved.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate(
                'product',
                'price'
            );
            const totalPrice = orderItem.product.price * orderItem.quantity;

            return totalPrice;
        })
    );
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    const order = {
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered
    };
    let newOrder = new Order(order);

    newOrder = await newOrder.save();

    if (!newOrder) {
        res.status(404).send('The Order cannot be created');
    }

    res.status(200).send(newOrder);
});

router.put('/:id', async (req, res) => {
    const order = {
        status: req.body.status
    };

    const updateOrder = await Order.findByIdAndUpdate(req.params.id, order, {
        new: true
    });

    if (!updateOrder) {
        res.status(404).send('The Order cannot be created');
    }

    res.status(200).send(updateOrder);
});

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
        .then(async (order) => {
            if (order) {
                await order.orderItems.map(async (orderItem) => {
                    await OrderItem.findByIdAndRemove(orderItem);
                });
                const response = {
                    success: true,
                    message: 'The order is deleted'
                };
                return res.status(200).json(response);
            } else {
                const response = {
                    success: false,
                    message: 'Order not found'
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

router.get(`/get/total-sales`, async (req, res) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: '$totalPrice'
                }
            }
        }
    ]);

    if (!totalSales) {
        res.status(400).json({
            message: 'The order sales cannot be generated'
        });
    }

    const response = {
        totalSales: totalSales.pop().totalSales
    };
    res.status(200).send(response);
    return;
});

router.get(`/get/count`, async (req, res) => {
    const ordersCount = await Order.countDocuments();

    if (!ordersCount) {
        const response = {
            status: false,
            message: 'Order is empty'
        };
        res.status(500).json(response);
    }

    res.status(200).send({ ordersCount });
});

router.get(`/get/user-orders/:userId`, async (req, res) => {
    const filter = {
        user: req.params.userId
    };
    const userOrders = await Order.find(filter)
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name',
                populate: 'category'
            }
        })
        .sort({ dateOrdered: -1 });

    if (!userOrders) {
        const response = {
            success: false
        };
        res.status(500).json(response);
    }

    res.status(200).send(userOrders);
    return;
});

module.exports = router;
