const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLE REJECTION', "Shutting down...");
    process.exit(1);
});

dotenv.config({path: './config.env'});
const app = require('./app');

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
    console.log('connected to database successfuly!');
});

app.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLE REJECTION', "Shutting down...");
    server.close(() => {
      process.exit(1);
    });
});