import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
} from '../lib/passwordUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const router = express.Router();

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'doctor', 'staff']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const getJwtSecret = () =>
  process.env.JWT_SECRET || 'kalpana_dental_secure_jwt_token_secret_key_2026';
export const JWT_EXPIRES_IN = '7d';

/**
 * In-memory fallback user store when offline or testing without database.
 * Default admin account has bcrypt hashed password for 'Admin@123':
 * "$2a$10$VwQ1g5U6YvO1Y34r6kFm0.aYvM7sK8tq9QG6T7u8X9Y0Z1A2B3C4D"
 */
export const memoryUsersStore = [
  {
    id: '11111111-2222-3333-4444-555555555555',
    full_name: 'Dr. Nikhil Hiralal Mahanubhav',
    email: 'admin@kalpanadental.com',
    password_hash: '$2a$10$d6h3jU1V6z5Z4E6T9N5E6uI2F3H5K8J9Q1W3E5R7T9Y1U3I5O7P9A', // Placeholder hash
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Ensure fallback in-memory admin password hash is properly initialized with bcrypt on startup
(async () => {
  try {
    memoryUsersStore[0].password_hash = await hashPassword('Admin@123');
  } catch (err) {
    console.error('Failed to pre-hash memory admin password:', err);
  }
})();

/**
 * Helper to find user by email in Supabase database or in-memory fallback
 */
async function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      if (!error && data) {
        return { user: data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('⚠️ Supabase user lookup exception, checking fallback:', err.message);
    }
  }

  const memoryUser = memoryUsersStore.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (memoryUser) {
    return { user: memoryUser, source: 'memory' };
  }

  return { user: null, source: 'none' };
}

/**
 * POST /api/auth/register
 * Hashes password using Bcrypt with 10 salt rounds before saving to database.
 * Plaintext password is NEVER stored.
 */
router.post('/register', async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const { fullName, email, password, role = 'doctor' } = validated;

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Validate password security strength
    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.valid) {
      return res.status(400).json({
        success: false,
        message: strengthCheck.message,
      });
    }

    // 2. Check if user already exists
    const { user: existingUser } = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    // 3. Cryptographically hash password with salt (Cost Factor: 10)
    const hashedPassword = await hashPassword(password);

    const userId = crypto.randomUUID();
    const newUserRecord = {
      id: userId,
      full_name: fullName.trim(),
      email: normalizedEmail,
      password_hash: hashedPassword, // Hashed string only!
      role: role === 'admin' ? 'admin' : 'doctor',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 4. Store in Supabase database
    let savedToDatabase = false;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('admin_users')
          .insert([newUserRecord]);

        if (error) {
          console.warn('⚠️ Could not insert into Supabase admin_users:', error.message);
        } else {
          savedToDatabase = true;
        }
      } catch (err) {
        console.error('⚠️ Supabase admin_users insert error:', err.message);
      }
    }

    // Always maintain in-memory store fallback
    memoryUsersStore.push(newUserRecord);

    // 5. Generate authentication token
    const token = jwt.sign(
      {
        id: newUserRecord.id,
        userId: newUserRecord.id,
        sub: newUserRecord.id,
        email: newUserRecord.email,
        role: newUserRecord.role,
        name: newUserRecord.full_name,
        fullName: newUserRecord.full_name,
      },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 6. Return response (NEVER return password or password_hash)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully with bcrypt password encryption.',
      token,
      user: {
        id: newUserRecord.id,
        fullName: newUserRecord.full_name,
        email: newUserRecord.email,
        role: newUserRecord.role,
      },
      storage: savedToDatabase ? 'supabase' : 'in_memory',
      security: {
        hashingAlgorithm: 'bcrypt',
        saltRounds: 10,
      },
    });
  } catch (err) {
    if (err?.name === 'ZodError') return next(err);
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to register user.',
      error: err.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Validates credentials by comparing input password against stored Bcrypt hash.
 */
router.post('/login', async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const { email, password } = validated;

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Lookup user
    const { user, source } = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // 2. Constant-time secure Bcrypt hash comparison
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact the administrator.',
      });
    }

    // 3. Issue signed JWT token
    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.full_name,
        fullName: user.full_name,
      },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 4. Update last_login timestamp asynchronously
    if (source === 'supabase' && isSupabaseConfigured) {
      supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)
        .then(() => {})
        .catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful. Password verified with Bcrypt.',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
      security: {
        hashingAlgorithm: 'bcrypt',
        verified: true,
      },
    });
  } catch (err) {
    if (err?.name === 'ZodError') return next(err);
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication.',
      error: err.message,
    });
  }
});

/**
 * Helper to verify JWT token from either backend or Supabase
 */
export async function verifyAnyToken(token) {
  if (!token) throw new Error('Token is required');

  // 1. Try local JWT
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return {
      decoded,
      source: 'local_jwt',
      id: decoded.id || decoded.userId || decoded.sub,
      email: decoded.email,
      role: decoded.role || 'admin',
      fullName: decoded.fullName || decoded.name || 'Admin User',
    };
  } catch (localErr) {
    // 2. Try Supabase JWT if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user: sbUser }, error: sbErr } = await supabase.auth.getUser(token);
        if (!sbErr && sbUser) {
          return {
            decoded: sbUser,
            source: 'supabase_auth',
            id: sbUser.id,
            email: sbUser.email,
            role: sbUser.user_metadata?.role || 'admin',
            fullName: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0],
          };
        }
      } catch (sbException) {
        // Fall through to throw original error
      }
    }
    throw localErr;
  }
}

/**
 * GET /api/auth/verify
 * Validates JWT token from Bearer header and returns user details.
 */
router.get('/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Missing or malformed Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = await verifyAnyToken(token);

    // Verify user is active if registered in database or memory
    if (verified.email) {
      const { user } = await findUserByEmail(verified.email);
      if (user && user.is_active === false) {
        return res.status(403).json({
          success: false,
          message: 'User account is deactivated.',
        });
      }
      if (user) {
        return res.status(200).json({
          success: true,
          valid: true,
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
          },
          source: verified.source,
        });
      }
    }

    return res.status(200).json({
      success: true,
      valid: true,
      user: {
        id: verified.id,
        fullName: verified.fullName,
        email: verified.email,
        role: verified.role,
      },
      source: verified.source,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      valid: false,
      message: 'Token is invalid or expired.',
      error: err.message,
    });
  }
});

/**
 * Express Middleware to protect endpoints with JWT authentication
 */
export async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = await verifyAnyToken(token);
    req.user = verified;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: err.message,
    });
  }
}

/**
 * POST /api/auth/change-password
 * Verifies current password hash, hashes new password with Bcrypt, and updates database.
 */
router.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body || {};

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email, current password, and new password are required.',
    });
  }

  const strengthCheck = validatePasswordStrength(newPassword);
  if (!strengthCheck.valid) {
    return res.status(400).json({
      success: false,
      message: strengthCheck.message,
    });
  }

  try {
    const { user, source } = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password.' });
    }

    // Hash the new password
    const newHashedPassword = await hashPassword(newPassword);

    if (source === 'supabase' && isSupabaseConfigured) {
      const { error } = await supabase
        .from('admin_users')
        .update({
          password_hash: newHashedPassword,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    }

    user.password_hash = newHashedPassword;

    return res.status(200).json({
      success: true,
      message: 'Password successfully updated and securely hashed with Bcrypt.',
    });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password.',
      error: err.message,
    });
  }
});

export default router;
