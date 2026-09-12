import bcrypt from 'bcryptjs';

/**
 * Standard salt rounds for Bcrypt hashing.
 * 10 rounds balances strong cryptographic resistance against brute-force
 * with fast server response times (~100ms per hash).
 */
export const DEFAULT_SALT_ROUNDS = 10;

/**
 * Validates password strength before hashing.
 * Enforces a minimum length of 8 characters with at least one letter and one number.
 * 
 * @param {string} password 
 * @returns {{ valid: boolean, message?: string }}
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required and must be a string.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter and one number.' };
  }
  return { valid: true };
}

/**
 * Cryptographically hashes a plain-text password using Bcrypt with salt.
 * 
 * @param {string} plainPassword - Plain-text password provided by user
 * @param {number} saltRounds - Cost factor (default: 10)
 * @returns {Promise<string>} - Bcrypt hash string (e.g. $2a$10$... or $2b$10$...)
 */
export async function hashPassword(plainPassword, saltRounds = DEFAULT_SALT_ROUNDS) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Invalid password provided for hashing.');
  }
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
}

/**
 * Securely verifies a plain-text password against a stored Bcrypt hash.
 * Constant-time comparison prevents timing attacks.
 * 
 * @param {string} plainPassword - User entered password
 * @param {string} hashedPassword - Stored Bcrypt hash from database
 * @returns {Promise<boolean>} - True if password matches hash, false otherwise
 */
export async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    console.error('Password comparison error:', err.message);
    return false;
  }
}

export default {
  DEFAULT_SALT_ROUNDS,
  validatePasswordStrength,
  hashPassword,
  comparePassword,
};
