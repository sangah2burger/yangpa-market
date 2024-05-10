// const sync = require('./models/sync');
// sync();

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

const authRouter = require('./routes/authRouter');
const saleRouter = require('./routes/saleRouter');
const checkAuth = require('./routes/authorization');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use('/user', authRouter);
app.use('/sale', checkAuth);
app.use('/sale', saleRouter);

app.listen(port);