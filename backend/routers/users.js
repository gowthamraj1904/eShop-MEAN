const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const users = await User.find().select('-passwordHash');

    if (!users) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(users);
});

router.get(`/:id`, async (req, res) => {
    const users = await User.findById(req.params.id).select('-passwordHash');

    if (!users) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(users);
});

router.post(`/`, async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country
    };
    let newUser = new User(user);

    newUser = await newUser.save();

    if (!newUser) {
        res.status(404).send('The User cannot be created');
    }

    res.status(200).send(newUser);
});

router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;

    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country
    };

    const updateUser = await User.findByIdAndUpdate(req.params.id, user, {
        new: true
    });

    if (!updateUser) {
        res.status(404).send('The User cannot be created');
    }

    res.status(200).send(updateUser);
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (user) {
                const response = {
                    success: true,
                    message: 'The user is deleted'
                };
                return res.status(200).json(response);
            } else {
                const response = {
                    success: false,
                    message: 'User not found'
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

router.post(`/login`, async (req, res) => {
    const filter = {
        email: req.body.email
    };
    const user = await User.findOne(filter);

    if (!user) {
        return res.status(400).send('The User not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        // SECRET is custom secret code for JWT
        const secret = process.env.SECRET;
        const token = jwt.sign(
            // Keep these user details in the token
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: '1d' // Will expire in 1 day
            }
        );

        // If user is authenticated, will send token in the response
        const response = {
            user: user.email,
            token: token
        };
        res.status(200).send(response);
    } else {
        res.status(400).send('Invalid password');
    }
});

router.post(`/register`, async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country
    };
    let newUser = new User(user);

    newUser = await newUser.save();

    if (!newUser) {
        res.status(404).send('The User cannot be created');
    }

    res.status(200).send(newUser);
});

router.get(`/get/count`, async (req, res) => {
    // Get all the count User.countDocuments();
    // Get user count with isAdmin
    const filter = {
        isAdmin: true
    };
    const usersCount = await User.countDocuments(filter);

    if (!usersCount) {
        const response = {
            status: false,
            message: 'User is empty'
        };
        res.status(500).json(response);
    }

    res.status(200).send({ usersCount });
});

module.exports = router;
