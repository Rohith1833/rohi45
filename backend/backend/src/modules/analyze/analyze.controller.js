const { processMessage } = require('./analyze.service');

const analyze = async (req, res, next) => {
  try {
    const result = await processMessage(req.body.message);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { analyze };
