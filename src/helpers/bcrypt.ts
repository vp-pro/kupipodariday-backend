import * as bcrypt from 'bcrypt';

export const createHashPassword = async (
  password: string,
  salt: number,
): Promise<string> => {
  const passHash = await bcrypt.hash(password, salt).then((hash) => {
    return hash;
  });

  return passHash;
};

export const checkPasswordHash = async (
  password,
  passwordHash,
): Promise<boolean> => {
  return await bcrypt.compare(password, passwordHash);
};
