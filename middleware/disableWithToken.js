module.exports.disableWithToken = (req, res, next) => {
  console.log('disableWithToken ran!');
    if(req.headers.Authorization || req.headers.authorization) {
      return res.status(400).json({
        generalMessage: 'Authorization problem',
        messages: [`You can't access this route with access token`]
      });
    }
    return next();
   }