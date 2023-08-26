import * as secrets from 'secrets.js-grempe';
import * as fs from 'fs';
import * as path from 'path';
import { reconstructSeed } from './reconstruct';

/**
 * Deconstructs a seed phrase into n shares and saves them into files.
 *
 * @param {string} seedPath - Path to the file containing the seed.
 * @param {number} n - The number of shares to divide the seed into.
 * @param {number} t - The threshold number of shares needed to reconstruct the seed.
 * @param {string} outputPath - The directory where the shares will be saved.
 * @param {boolean} overwrite - If true, overwrite existing share files.
 *
 * @returns {string[]} The generated shares.
 */
export const deconstructSeedPhraseAndSaveInFile = (
  seedPath: string,
  n: number,
  t: number,
  outputPath: string,
  overwrite: boolean,
): string[] => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Read the seed from the file
  const seed = fs.readFileSync(seedPath, 'utf-8');
  // Extract the seed name from the file name
  const seedName = path.basename(seedPath);

  // Deconstruct the seed phrase into shares
  const shares = deconstructSeedPhrase(seed, n, t);
  validateShares(seed, shares, t);

  // Iterate through each share and write to a file
  shares.forEach((share, shareIndex) => {
    const fileName = `seeds-share-${shareIndex}`;
    const filePath = path.join(outputPath, fileName);

    // Create the content with the specified format
    const content = `${seedName}: ${share}\n`;

    // Write the content to the file
    if (overwrite && fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    } else {
      fs.appendFileSync(filePath, content);
    }
  });

  return shares;
};

/**
 * Validates that the shares reconstruct to the original seed, both with and without the required threshold.
 *
 * @param {string} seed - The original seed.
 * @param {string[]} shares - The generated shares.
 * @param {number} t - The threshold number of shares needed to reconstruct the seed.
 */
const validateShares = (seed: string, shares: string[], t: number): void => {
  let reconstructedSeed = reconstructSeed(shares.slice(0, t - 1));
  if (reconstructedSeed === seed)
    console.error(
      'The reconstructed seed match the original seed without the requires threshold number of shares',
    );

  reconstructedSeed = reconstructSeed(shares.slice(0, t));
  if (reconstructedSeed !== seed)
    console.error(
      'The reconstructed seed does not match the original seed with the requires threshold number of shares',
    );
};

/**
 * Deconstructs the seed phrase into n shares.
 *
 * @param {string} seed - The seed to deconstruct.
 * @param {number} n - The number of shares to divide the seed into.
 * @param {number} t - The threshold number of shares needed to reconstruct the seed.
 *
 * @returns {string[]} The generated shares.
 */
const deconstructSeedPhrase = (seed: string, n: number, t: number): string[] => {
  return secrets.share(secrets.str2hex(seed), n, t);
};
