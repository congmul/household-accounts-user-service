import bcrypt from "bcrypt";

const passwordHash = {
  hash: (password: string) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  },
  compare: (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },
};

export default passwordHash;
