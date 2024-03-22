// will work on this in the future
exports.validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }
    next();
  };
  