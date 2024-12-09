import bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/user.model';

const FILE_PATH = path.resolve(__dirname, '../../data/users.json');

export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data) as User[];
  } catch {
    return [];
  }
};

export const saveUsers = async (users: User[]): Promise<void> => {
  await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
