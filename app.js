//1 packages
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

//1.1 routes
const userRouter = require('./routes/userRoutes');
const problemRouter = require('./routes/problemRoutes');
const hintRouter = require('./routes/hintRoutes');

//1.2 Controllers
const errorController = require('./controllers/errorController');

//2 const variables
const app = express();

//3 midlewares

//midlewares for testing
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
    });
}

//midleware to secure the express app
app.use(helmet());

//Limit requests from same IP
const limiter = rateLimiter({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try after one houre'
});
app.use('/api', limiter);

//body parser
app.use(express.json({limit: '10KB'}));

//Data sanitizaion NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//4 Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/hint', hintRouter);

app.use(errorController);


module.exports = app;