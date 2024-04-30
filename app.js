//1 Packages
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cron = require('node-cron');

//2 Get Routes
const userRouter = require('./routes/userRoutes');
const problemRouter = require('./routes/problemRoutes');
const hintRouter = require('./routes/hintRoutes');
const contestRouter = require('./routes/contestRoutes');

//3 Controllers
const errorController = require('./controllers/errorController');
const updateUsers = require('./utils/updateUsers');

//4 Const Variables
const app = express();

//5 Midlewares

//Midlewares for testing
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
    });
}

//Midleware to secure the express app
app.use(helmet());

//Limit requests from same IP
const limiter = rateLimiter({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try after one houre'
});
app.use('/api', limiter);

//Body parser
app.use(express.json({limit: '10KB'}));

//Data sanitizaion NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//6 Routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/hints', hintRouter);
app.use('/api/v1/contest', contestRouter);

app.use(errorController);

//Updating a user points every 30 seconds 
cron.schedule('* * * * *', () => {
    updateUsers();
});


module.exports = app;