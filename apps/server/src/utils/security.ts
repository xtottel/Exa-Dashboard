// utils/security.ts
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate API key pair
export const generateApiKeyPair = () => {
  const key = generateSecureToken(32);
  const secret = generateSecureToken(64);
  return { key, secret };
};

// Password validation
export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is strong' };
};

// IP address validation and rate limiting
export const isIpAllowed = (ip: string, allowedIps: string[]): boolean => {
  if (allowedIps.includes('*')) return true;
  
  return allowedIps.some(allowedIp => {
    if (allowedIp === ip) return true;
    
    // Check CIDR notation
    if (allowedIp.includes('/')) {
      // Implement CIDR matching logic here
      // This is a simplified version
      return ip.startsWith(allowedIp.split('/')[0]);
    }
    
    return false;
  });
};

// Generate MFA backup codes
export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(crypto.randomInt(10000000, 99999999).toString());
  }
  return codes;
};

// Hash data with salt
export const hashData = async (data: string, saltRounds: number = 10): Promise<string> => {
  return bcrypt.hash(data, saltRounds);
};

// Verify hashed data
export const verifyHash = async (data: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(data, hash);
};