// Import TronWeb via CommonJS to avoid ESM initialization issues in Next.js App Router

const Full_HOST = process.env.Full_HOST!;

const pkg = require('tronweb');
const { TronWeb } = pkg;

export const createTronWebInstance = (privateKey: string) => {
  return new TronWeb({
    fullHost: Full_HOST,
    privateKey,
  });
};

export const createReadOnlyTronWebInstance = () => {
  return new TronWeb({
    fullHost: Full_HOST,
  });
};
