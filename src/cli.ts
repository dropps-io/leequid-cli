#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { deconstructSeedPhraseAndSaveInFile } from './shamir/deconstruct';
import { reconstructAndSaveInFile } from './shamir/reconstruct';
import { generateKeyPair } from './encryption/generate-key';
import { encryptSharesWithPublicKeys } from './encryption/encrypt';
import { decryptFileWithPrivateKey } from './encryption/decrypt';

yargs(hideBin(process.argv))
  .command(
    'deconstruct',
    'Deconstruct a seed phrase into shares',
    (yargs) => {
      return yargs
        .option('seed', {
          type: 'string',
          description: 'Path to the seed file',
          demandOption: true,
        })
        .option('n', {
          type: 'number',
          description: 'Total number of shares to generate',
          demandOption: true,
        })
        .option('t', {
          type: 'number',
          description: 'Threshold number of shares required to reconstruct the seed phrase',
          demandOption: true,
        })
        .option('output', {
          type: 'string',
          description: 'Output path to save shares',
          demandOption: true,
        })
        .option('overwrite', {
          type: 'boolean',
          description: 'Whether to overwrite the file content',
        });
    },
    (argv) => {
      deconstructSeedPhraseAndSaveInFile(argv.seed, argv.n, argv.t, argv.output, argv.overwrite);
    },
  )
  .command(
    'reconstruct',
    'Reconstruct a seed phrase from shares',
    (yargs) => {
      return yargs
        .option('shares', {
          type: 'string',
          description: 'Path to the directory containing the share files',
          demandOption: true,
        })
        .option('output', {
          type: 'string',
          description: 'Output path to save the reconstructed seed',
          demandOption: true,
        });
    },
    (argv) => {
      reconstructAndSaveInFile(argv.shares, argv.output);
    },
  )
  .command(
    'generate-keypair',
    'Generate a public and private key pair',
    (yargs) => {
      return yargs.option('output', {
        type: 'string',
        description: 'Output path to save the keys',
        demandOption: true,
      });
    },
    (argv) => {
      generateKeyPair(argv.output);
    },
  )
  .command(
    'encrypt-shares',
    'Encrypt shares with corresponding public keys',
    (yargs) => {
      return yargs
        .option('pubkeys', {
          type: 'string',
          description: 'Path to the folder containing the public key files',
          demandOption: true,
        })
        .option('shares', {
          type: 'string',
          description: 'Path to the folder containing the share files',
          demandOption: true,
        });
    },
    (argv) => {
      encryptSharesWithPublicKeys(argv.pubkeys, argv.shares);
    },
  )
  .command(
    'decrypt',
    'Decrypt the content of a file with the given private key',
    (yargs) => {
      return yargs
        .option('file', {
          type: 'string',
          description: 'Path to the file that needs to be decrypted',
          demandOption: true,
        })
        .option('private-key', {
          type: 'string',
          description: 'Path to the private key to use for decryption',
          demandOption: true,
        });
    },
    async (argv) => {
      await decryptFileWithPrivateKey(argv.file, argv['private-key']);
      console.log(`Decrypted the content of ${argv.file} successfully.`);
    },
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help().argv;
