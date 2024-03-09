const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};
const sendErrorPro = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    if (err.response && err.response.request.host === 'codeforces.com') err.message = err.response.data.comment;
    if (err.code === 11000) {
        err.message = `There is another user has this ${Object.keys(err.keyValue)}, please change '${Object.values(err.keyValue)}' and try again!`;
        err.statusCode = 400
    }
    if (err.code === 'ETIMEDOUT') {
        err.message = 'It took a lot of time getting data. Be sure codeforces is working correctly handling requstes then try again.';
        err.statusCode = 504
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else {
        sendErrorPro(err, req, res);
    }
}