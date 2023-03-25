const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, (req, res) => {
    User.find()
        .select('-passwordHash')
        .then((users) => {
            res.status(200).send(users);
        })
        .catch((error) => {
            const response = {
                message: 'Users are empty',
                error
            };
            res.status(400).json(response);
        });
});

router.get(`/:id`, (req, res) => {
    User.findById(req.params.id)
        .select('-passwordHash')
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((error) => {
            const response = {
                message: 'User ise empty',
                error
            };
            res.status(400).json(response);
        });
});

router.post(`/`, (req, res) => {
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

    newUser
        .save()
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((error) => {
            const response = {
                message: 'The User cannot be created',
                error
            };
            res.status(400).json(response);
        });
});

router.put('/:id', (req, res) => {
    User.findById(req.params.id)
        .then((userExist) => {
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

            User.findByIdAndUpdate(req.params.id, user, {
                new: true
            })
                .then((updatedUser) => {
                    res.status(200).send(updatedUser);
                })
                .catch((error) => {
                    const response = {
                        message: 'The User cannot be created',
                        error
                    };
                    res.status(400).json(response);
                });
        })
        .catch((error) => {
            const response = {
                message: 'The User cannot be found',
                error
            };
            res.status(400).json(response);
        });
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (user) {
                const response = {
                    message: 'The user is deleted'
                };
                res.status(200).json(response);
            } else {
                const response = {
                    message: 'User not found'
                };
                res.status(404).json(response);
            }
        })
        .catch((error) => {
            const response = {
                message: 'The user is not deleted',
                error
            };
            res.status(400).json(response);
        });
});

router.post(`/login`, (req, res) => {
    const filter = {
        email: req.body.email
    };

    User.findOne(filter)
        .then((user) => {
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
                const response = {
                    message: 'Invalid password',
                    error
                };
                res.status(400).json(response);
            }
        })
        .catch((error) => {
            const response = {
                message: 'The User not found',
                error
            };
            res.status(400).json(response);
        });
});

router.post(`/register`, (req, res) => {
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

    newUser
        .save()
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((error) => {
            const response = {
                message: 'The User cannot be created',
                error
            };
            res.status(400).json(response);
        });
});

router.get(`/get/count`, (req, res) => {
    // Get all the count User.countDocuments();
    // Get user count with isAdmin
    const filter = {
        // isAdmin: true
    };

    User.countDocuments(filter)
        .then((usersCount) => {
            res.status(200).send({ usersCount });
        })
        .catch((error) => {
            const response = {
                message: 'User is empty',
                error
            };
            res.status(400).json(response);
        });
});

module.exports = router;
