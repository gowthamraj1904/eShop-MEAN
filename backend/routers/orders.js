const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

router.get(`/`, (req, res) => {
    // Populate - Get user details and the second argument is which fields are required in the Order response
    Order.find()
        .populate('user', 'name')
        .sort({ dateOrdered: -1 })
        .then((orders) => {
            res.status(200).send(orders);
        })
        .catch((error) => {
            const response = {
                message: 'Orders are not available',
                error
            };
            res.status(400).json(response);
        });
});

router.get('/:id', (req, res) => {
    Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name',
                populate: 'category'
            }
        })
        .then((order) => {
            res.status(200).send(order);
        })
        .catch((error) => {
            const response = {
                message: 'Order is not available',
                error
            };
            res.status(400).json(response);
        });
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
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
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

    newOrder
        .save()
        .then((order) => {
            res.status(200).send(order);
        })
        .catch((error) => {
            const response = {
                message: 'The Order cannot be created',
                error
            };
            res.status(400).json(response);
        });
});

router.put('/:id', (req, res) => {
    const order = {
        status: req.body.status
    };

    Order.findByIdAndUpdate(req.params.id, order, {
        new: true
    })
        .then((order) => {
            res.status(200).send(order);
        })
        .catch((error) => {
            const response = {
                message: 'The Order cannot be created',
                error
            };
            res.status(400).json(response);
        });
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

                res.status(200).json(response);
            } else {
                const response = {
                    message: 'Order not found'
                };
                res.status(404).json(response);
            }
        })
        .catch((error) => {
            const response = {
                message: 'The Order cannot be deleted',
                error
            };
            res.status(400).json(response);
        });
});

router.get(`/get/total-sales`, (req, res) => {
    Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: '$totalPrice'
                }
            }
        }
    ])
        .then((totalSales) => {
            const response = {
                totalSales: totalSales.pop().totalSales
            };
            res.status(200).send(response);
        })
        .catch((error) => {
            const response = {
                message: 'The order sales cannot be generated',
                error
            };
            res.status(400).json(response);
        });
});

router.get(`/get/count`, (req, res) => {
    Order.countDocuments()
        .then((ordersCount) => {
            res.status(200).send({ ordersCount });
        })
        .catch((error) => {
            const response = {
                message: 'Order is empty',
                error
            };
            res.status(400).json(response);
        });
});

router.get(`/get/user-orders/:userId`, (req, res) => {
    const filter = {
        user: req.params.userId
    };

    Order.find(filter)
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name',
                populate: 'category'
            }
        })
        .sort({ dateOrdered: -1 })
        .then((userOrders) => {
            res.status(200).send(userOrders);
        })
        .catch((error) => {
            const response = {
                message: 'Order is empty',
                error
            };
            res.status(400).json(response);
        });
});

module.exports = router;
