const express = require('express');
require('./db/mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userRouter = require('./routers/user');
const linkRouter = require('./routers/link');

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use(userRouter);
app.use(linkRouter);

app.listen(port, () => {
    console.log("Server is running at " + port);
});