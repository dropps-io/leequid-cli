import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Encrypts the shares with corresponding public keys.
 *
 * @param {string} pubKeysPath - Path to the directory containing the public key files.
 * @param {string} sharesPath - Path to the directory containing the share files.
 */
export const encryptSharesWithPublicKeys = (pubKeysPath: string, sharesPath: string): void => {
  let i = 0;

  /* eslint no-constant-condition: "off" */
  while (true) {
    const publicKeyFile = path.join(pubKeysPath, `pubkey-${i}`);
    const shareFile = path.join(sharesPath, `seeds-share-${i}`);

    // Break the loop if either the public key or share file does not exist
    if (!fs.existsSync(publicKeyFile) || !fs.existsSync(shareFile)) break;

    // Read the public key
    const publicKey = fs.readFileSync(publicKeyFile, 'utf-8');

    // Read the share
    const share = fs.readFileSync(shareFile, 'utf-8');

    // Generate a random symmetric key
    const symmetricKey = crypto.randomBytes(32);

    // Encrypt the share using the symmetric key
    const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, Buffer.alloc(16, 0));
    const encryptedShare = Buffer.concat([cipher.update(share, 'utf8'), cipher.final()]);

    // Encrypt the symmetric key using the public key
    const encryptedSymmetricKey = crypto.publicEncrypt(publicKey, symmetricKey);

    // Write the encrypted symmetric key and the encrypted share back to the file
    fs.writeFileSync(
      shareFile,
      encryptedSymmetricKey.toString('hex') + ':' + encryptedShare.toString('hex'),
    );

    i++;
  }
};
