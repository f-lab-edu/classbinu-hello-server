import { randomBytes } from 'crypto';

export const randomCodeGenerator = (length: number = 48) => {
  const bytesNeeded = Math.ceil(length / 2);
  const randomData = randomBytes(bytesNeeded);
  const randomCode = randomData.toString('hex').slice(0, length).toUpperCase();
  return randomCode;
};
