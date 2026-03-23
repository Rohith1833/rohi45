const validateAnalyze = (req, res, next) => {
  const { message } = req.body || {};

  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'message field is required' });
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return res.status(400).json({ error: 'message cannot be empty' });
  }

  if (trimmedMessage.length > 500) {
    return res.status(400).json({ error: 'message too long (max 500 characters)' });
  }

  req.body.message = trimmedMessage;
  next();
};

module.exports = { validateAnalyze };
