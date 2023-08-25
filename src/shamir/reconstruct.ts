import * as fs from 'fs';
import * as path from 'path';
import * as secrets from 'secrets.js-grempe';

/**
 * Reconstructs a seed from the shares and saves it into a file.
 *
 * @param {string} sharesPath - The directory containing the share files.
 * @param {string} outputPath - The directory where the reconstructed seed will be saved.
 */
export const reconstructAndSaveInFile = (sharesPath: string, outputPath: string): void => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Read the shares from the files
  const shares: string[] = [];
  let i = 0;
  while (fs.existsSync(path.join(sharesPath, `share-${i}`))) {
    const shareContent = fs.readFileSync(path.join(sharesPath, `share-${i}`), 'utf-8');
    shares.push(shareContent.trim());
    i++;
  }

  // Reconstruct the seed using the provided function
  const reconstructedSeed = reconstructSeed(shares);

  // Write the recovered seed to the specified output path
  fs.writeFileSync(path.join(outputPath, 'recovered-seed'), reconstructedSeed);
};

/**
 * Reconstructs a seed from the shares.
 *
 * @param {string[]} shares - The shares used to reconstruct the seed.
 *
 * @returns {string} The reconstructed seed.
 */
export const reconstructSeed = (shares: string[]): string => {
  const reconstructedSeedHex: string = secrets.combine(shares);
  return secrets.hex2str(reconstructedSeedHex);
};
