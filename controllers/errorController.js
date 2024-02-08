const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};
const sendErrorPro = (err, req, res) => {
    if (err.code === 11000) {
        err.message = `There is another user has this ${Object.keys(err.keyPattern)}, please change it and try again!`;
        err.statusCode = 400
    }
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    if (err.response && err.response.request.host === 'codeforces.com') err.message = err.response.data.comment;
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else {
        sendErrorPro(err, req, res);
    }
}