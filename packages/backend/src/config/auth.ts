/**
 * Authentication configuration
 */
export const authConfig = {
    // JWT configuration
    jwt: {
      secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
      accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '1h',
      refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
    
    // Password configuration
    password: {
      saltRounds: 10, // Number of salt rounds for bcrypt
      minLength: 8, // Minimum password length
    },
    
    // User roles
    roles: {
      user: 'user',
      admin: 'admin',
      dealer: 'dealer',
      cutter: 'cutter',
      appraiser: 'appraiser',
    },
    
    // Cookie configuration
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }