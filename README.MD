# leequid-cli

## Overview

`leequid-cli` is a Command Line Interface (CLI) that provides tools for managing validator keys and shares in a secure and flexible manner. The CLI allows users to deconstruct seed phrases into `n` shares, encrypt them for shareholders, and perform various operations related to key management and decryption.

## Features

### Deconstruct a Seed Phrase into Shares

Split a given seed phrase into `n` shares, with a specified threshold `t` number of shares required to reconstruct the seed phrase.

```bash
leequid-cli deconstruct --seed <seed-file-path> --n <total-shares> --t <threshold> --output <output-path> [--overwrite]
```

### Reconstruct a Seed Phrase from Shares

Reconstruct a seed phrase from shares stored in a specific directory.

```bash
leequid-cli reconstruct --shares <directory-containing-share-files> --output <output-path>
```

### Generate a Key Pair

Generate a public and private key pair, saving them to the specified path.

```bash
leequid-cli generate-keypair --output <output-path>
```

### Encrypt Shares with Public Keys

Encrypt shares with corresponding public keys.

```bash
leequid-cli encrypt-shares --pubkeys <folder-containing-public-key-files> --shares <folder-containing-share-files>
```

### Decrypt a File with a Private Key

Decrypt the content of a file using a given private key.

```bash
leequid-cli decrypt --file <file-to-decrypt> --private-key <private-key-path>
```

## Installation

Make sure you have Node.js installed on your machine, and then run the following commands:

```bash
git clone <repository-url>
cd leequid-cli
npm install
npm run build
```

## Usage

After building the project, you can run the CLI using:

```bash
node ./dist/cli.js <command> [options]
```

Run `node ./dist/cli.js --help` to see the available commands and options.

## Dependencies

- "readline-sync": "^1.4.10"
- "secrets.js-grempe": "^2.0.0"
- "yargs": "^17.7.2"

## Development

Use the following commands for development:

- `npm run compile`: Compile the TypeScript code
- `npm run build`: Build the executable using pkg

## Author

[Samuel VIDEAU](https://github.com/samuel-videau)

---

This project is designed with security and flexibility in mind. Please ensure that you understand the implications of the options and commands you are using. Feel free to open an issue or submit a pull request for further enhancements.