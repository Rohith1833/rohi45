const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/echodesk',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MODEL_NAME: process.env.MODEL_NAME || 'gpt-4o-mini',
  LLM_TIMEOUT_MS: Number(process.env.LLM_TIMEOUT_MS) || 4000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
};

module.exports = env;
