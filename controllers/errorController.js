const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    if (err.response && err.response.request.host === 'codeforces.com') err.message = err.response.data.comment;
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }   
}