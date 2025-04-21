import jwt from 'jsonwebtoken'
import { authConfig } from '@/config/auth'

// Type to ensure we have a proper Secret type that jwt can work with
const getJwtSecret = (): jwt.Secret => {
  const secret = authConfig.jwt.secret
  if (typeof secret !== 'string' || !secret) {
    throw new Error('JWT secret is not properly configured')
  }
  return secret
}

/**
 * Generate a JWT token
 * @param payload Data to include in the token
 * @param expiresIn Expiration time (default: from config)
 * @returns JWT token
 */
export const generateToken = (
  payload: Record<string, any>,
  expiresIn = authConfig.jwt.accessTokenExpiration
): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn })
}

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, getJwtSecret())
}

/**
 * Generate a refresh token
 * @param payload Data to include in the token
 * @returns Refresh token
 */
export const generateRefreshToken = (payload: Record<string, any>): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: authConfig.jwt.refreshTokenExpiration,
  })
} 