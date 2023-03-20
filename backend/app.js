const express = require('express');
const app = express();

// To log HTTP request
const morgan = require('morgan');
// To connect MongoDB
const mongoose = require('mongoose');
// For avoid CORS issue
const cors = require('cors');
// For Environment variable
require('dotenv/config');

const port = process.env.PORT;
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;
// const { options } = require('nodemon/lib/config');
// Routers
const categoriesRouter = require('./routers/categories');
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders');
const usersRouter = require('./routers/users');
const authJwt = require('./helpers/jwt');
const handlerErr = require('./helpers/error-handler');

// Middleware
// CORS
app.use(cors());
app.options('*', cors());
// To JSON
app.use(express.json());
// To log HTTP requests
app.use(morgan('tiny'));
// JWT Token Authentication
app.use(authJwt());
// Error Handler
app.use(handlerErr);
// Routers
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

// MongoDB Connection
mongoose
    .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'eshop-database'
    })
    .then((res) => {
        console.log('database connection is ready');
    })
    .catch((err) => {
        console.log('Database connection failed', err);
    });

// Run the server with port
app.listen(port, () => {
    console.log('Server is running');
});
