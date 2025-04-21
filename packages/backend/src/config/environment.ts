/**
 * Environment configuration
 */
export const environmentConfig = {
    // Node environment
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Is production environment
    isProduction: process.env.NODE_ENV === 'production',
    
    // Is development environment
    isDevelopment: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined,
    
    // Is test environment
    isTest: process.env.NODE_ENV === 'test',
    
    // Server port
    port: parseInt(process.env.PORT || '5000'),
    
    // Server host
    host: process.env.HOST || 'localhost',
    
    // API prefix
    apiPrefix: process.env.API_PREFIX || '/api',
    
    // Base URL for the application
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || '5000'}`,
  }