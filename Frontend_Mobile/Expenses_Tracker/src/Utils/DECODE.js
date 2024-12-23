import CryptoJS from 'crypto-js';
import logger from './logger';

// Replace 'YourEncryptionKey' with your actual encryption key
const encryptionKey = 'SMFI-53!SV6p%ye';

const encryptData = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
  return ciphertext;
};

const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    if (bytes.sigBytes === 0) {
      throw new Error('Decryption failed');
    }
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    logger.error('Decryption error:', error);
    return null;
  }
};

export { encryptData, decryptData };
