import * as readlineSync from 'readline-sync';
import { generateKeyPairSync } from 'crypto';
import * as fs from 'fs';

/**
 * Generates a public-private key pair and saves them to files.
 *
 * @param {string} outputPath - The directory where the keys will be saved.
 */
export const generateKeyPair = (outputPath: string): void => {
  const passphrase = readlineSync.question('Enter the passphrase: ', {
    hideEchoBack: true, // This hides the passphrase from being displayed
  });

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase, // Include the passphrase here
    },
  });

  // Save the keys to files
  fs.writeFileSync(`${outputPath}/pubkey`, publicKey);
  fs.writeFileSync(`${outputPath}/privatekey`, privateKey);
};
