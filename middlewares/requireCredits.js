// Reusable middleware to check if user has credits available to perform operations in the app that require payment through stripe.

module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    // use 403 forbidden status code (402 would be better, but it is not in public use yet)
    return res.status(403).send({ error: 'Not enough credits!' });
  }

  next();
};