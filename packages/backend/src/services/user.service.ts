/**
 * User service
 */
import db from '../db'
import { ApiError } from '../api/middlewares/error.middleware'
import { handleDatabaseError } from '../utils/errorHandler'

/**
 * Get all users (with pagination)
 * @param limit Maximum number of users to return
 * @param offset Number of users to skip
 * @param role Optional role filter
 */
export const getUsers = async (
  limit = 10,
  offset = 0,
  role?: string
) => {
  try {
    let query = `
      SELECT id, name, email, role, is_verified, created_at, last_login
      FROM users
    `
    const params: (string | number)[] = []

    // Add role filter if provided
    if (role) {
      query += ' WHERE role = $1'
      params.push(role)
    }

    // Add pagination
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`
    params.push(limit, offset)

    // Get users
    const result = await db.query(query, params)

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM users'
    if (role) {
      countQuery += ' WHERE role = $1'
    }
    const countResult = await db.query(countQuery, role ? [role] : [])

    return {
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    }
  } catch (error) {
    throw handleDatabaseError(error)
  }
}

/**
 * Get user by ID
 * @param userId User ID
 */
export const getUserById = async (userId: string) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, is_verified, created_at, last_login
       FROM users WHERE id = $1`,
      [userId]
    )

    if (result.rowCount === 0) {
      throw new ApiError(404, 'User not found')
    }

    return result.rows[0]
  } catch (error) {
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Update user profile
 * @param userId User ID
 * @param userData User data to update
 */
export const updateUser = async (
  userId: string,
  userData: { name?: string; email?: string }
) => {
  try {
    // Construct update query based on provided fields
    const fields: string[] = []
    const values: string[] = []
    const parameters: (string | Date)[] = []

    if (userData.name) {
      fields.push('name')
      parameters.push(userData.name)
      values.push(`$${parameters.length}`)
    }

    if (userData.email) {
      fields.push('email')
      parameters.push(userData.email)
      values.push(`$${parameters.length}`)
    }

    // No fields to update
    if (fields.length === 0) {
      return await getUserById(userId)
    }

    // Add updated_at field
    fields.push('updated_at')
    values.push('NOW()')

    // Add user ID to parameters
    parameters.push(userId)

    // Construct and execute update query
    const updateQuery = `
      UPDATE users
      SET ${fields.map((field, i) => `${field} = ${values[i]}`).join(', ')}
      WHERE id = $${parameters.length}
      RETURNING id, name, email, role, is_verified, created_at, last_login
    `

    const result = await db.query(updateQuery, parameters)

    if (result.rowCount === 0) {
      throw new ApiError(404, 'User not found')
    }

    return result.rows[0]
  } catch (error) {
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Delete a user
 * @param userId User ID
 */
export const deleteUser = async (userId: string) => {
  try {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    )

    if (result.rowCount === 0) {
      throw new ApiError(404, 'User not found')
    }

    return { success: true }
  } catch (error) {
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Get user profile with additional details
 * @param userId User ID
 */
export const getUserProfile = async (userId: string) => {
  try {
    // Get basic user info
    const user = await getUserById(userId)

    // Check if user is a professional
    const professionalResult = await db.query(
      `SELECT professional_type, company_name, verification_status
       FROM professional_profiles
       WHERE user_id = $1`,
      [userId]
    )

    const professional = professionalResult.rowCount && professionalResult.rowCount > 0
      ? professionalResult.rows[0]
      : null

    // Get user stats
    const statsResult = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM gemstones WHERE owner_id = $1) AS gemstones_count,
        (SELECT COUNT(*) FROM rough_stones WHERE owner_id = $1) AS rough_stones_count,
        (SELECT COUNT(*) FROM jewelry_items WHERE owner_id = $1) AS jewelry_count
      `,
      [userId]
    )

    const stats = statsResult.rows[0] || {
      gemstones_count: 0,
      rough_stones_count: 0,
      jewelry_count: 0
    }

    return {
      ...user,
      professional,
      stats
    }
  } catch (error) {
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Search users
 * @param searchTerm Search term for name or email
 * @param limit Maximum number of users to return
 * @param offset Number of users to skip
 */
export const searchUsers = async (
  searchTerm: string,
  limit = 10,
  offset = 0
) => {
  try {
    const query = `
      SELECT id, name, email, role, is_verified, created_at
      FROM users
      WHERE name ILIKE $1 OR email ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `
    
    const countQuery = `
      SELECT COUNT(*)
      FROM users
      WHERE name ILIKE $1 OR email ILIKE $1
    `
    
    const searchPattern = `%${searchTerm}%`
    
    const result = await db.query(query, [searchPattern, limit, offset])
    const countResult = await db.query(countQuery, [searchPattern])
    
    return {
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    }
  } catch (error) {
    throw handleDatabaseError(error)
  }
}
