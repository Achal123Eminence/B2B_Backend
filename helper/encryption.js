import crypto from 'crypto';
import { ENCRYPTION_SECRET_KEY, ENCRYPTION_IV, ENCRYPTION_ALGO } from '../common/constants.js';

const algorithm = ENCRYPTION_ALGO || 'aes-256-cbc';
const secretKey = ENCRYPTION_SECRET_KEY || '12345678901234567890123456789012'; // 32 bytes
const iv = ENCRYPTION_IV || '1234567890123456'; // 16 bytes

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};