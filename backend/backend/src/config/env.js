const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/echodesk',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'openai',
  MODEL_NAME: process.env.MODEL_NAME || 'gpt-4o-mini',
  LLM_TIMEOUT_MS: Number(process.env.LLM_TIMEOUT_MS) || 20000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
};

module.exports = env;
