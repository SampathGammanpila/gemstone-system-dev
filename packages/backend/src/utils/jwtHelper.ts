import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import { authConfig } from '@/config/auth'

// Type to ensure we have a proper Secret type that jwt can work with
const getJwtSecret = (): Secret => {
  const secret = authConfig.jwt.secret
  if (typeof secret !== 'string' || !secret) {
    throw new Error('JWT secret is not properly configured')
  }
  return secret
}

// Helper function to ensure expiresIn is the correct type
const getExpiresIn = (value: string | number | undefined): jwt.SignOptions['expiresIn'] => {
  return value as jwt.SignOptions['expiresIn']
}

/**
 * Generate a JWT token
 * @param payload Data to include in the token
 * @param expiresIn Expiration time (default: from config)
 * @returns JWT token
 */
export const generateToken = (
  payload: Record<string, any>,
  expiresIn = getExpiresIn(authConfig.jwt.accessTokenExpiration)
): string => {
  const options: SignOptions = { expiresIn }
  return jwt.sign(payload, getJwtSecret(), options)
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
  const options: SignOptions = { 
    expiresIn: getExpiresIn(authConfig.jwt.refreshTokenExpiration)
  }
  return jwt.sign(payload, getJwtSecret(), options)
} 