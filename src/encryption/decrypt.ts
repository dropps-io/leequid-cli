import * as crypto from 'crypto';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';

/**
 * Decrypts a file using a private key and passphrase.
 *
 * @param {string} filePath - Path to the file to decrypt.
 * @param {string} privateKeyPath - Path to the private key.
 *
 * @returns {Promise<void>} Resolves when the decryption is complete.
 */
export const decryptFileWithPrivateKey = async (
  filePath: string,
  privateKeyPath: string,
): Promise<void> => {
  const passphrase = readlineSync.question('Enter the passphrase: ', {
    hideEchoBack: true, // This hides the passphrase from being displayed
  });

  // Read the encrypted data from the file
  const [encryptedSymmetricKeyHex, encryptedShareHex] = fs
    .readFileSync(filePath, 'utf-8')
    .split(':');

  // Convert hex to buffer
  const encryptedSymmetricKey = Buffer.from(encryptedSymmetricKeyHex, 'hex');
  const encryptedShare = Buffer.from(encryptedShareHex, 'hex');

  // Read the private key
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

  // Decrypt the symmetric key using the private key and passphrase
  const symmetricKey = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: passphrase,
    },
    encryptedSymmetricKey,
  );

  // Decrypt the share using the symmetric key
  const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, Buffer.alloc(16, 0));
  const decryptedShare = Buffer.concat([
    decipher.update(encryptedShare),
    decipher.final(),
  ]).toString('utf-8');

  // Write the decrypted share back to the file
  fs.writeFileSync(filePath, decryptedShare);
};
