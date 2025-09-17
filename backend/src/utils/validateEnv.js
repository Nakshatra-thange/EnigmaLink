const validateEnv = () => {
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'CLIENT_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRES_IN'
  ];

  // In production, we use a single MONGO_URI. In development, we use separate vars.
  if (process.env.NODE_ENV === 'production') {
    requiredVars.push('MONGO_URI');
  } else {
    requiredVars.push('MONGO_USER', 'MONGO_PASSWORD', 'MONGO_HOST', 'MONGO_PORT', 'MONGO_DB_NAME');
  }

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  console.log('Environment variables validated successfully.');
};

module.exports = validateEnv;