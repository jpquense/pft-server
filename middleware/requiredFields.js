module.exports = (...fields) => (req, res, next) => {
  console.log('requiredFields ran!');
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if(!(field in req.body && req.body[field])) {
        const message = `The ${field} field is missing from your request body`;
        return res.status(400).json({
          generalMessage: 'Validation Error',
          messages: [message],
        });
      }
    }
    return next();
  }