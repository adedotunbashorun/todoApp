import { Controller, Get, Post, Body, Res } from 'routing-controllers';
import { comparePassword, getUsers, hashPassword, saveUsers } from '../core/services/auth.service';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserSigninDto, UserSignupDto } from '../core/dtos/user.dto';
import { User } from '../core/models/user.model';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key'; // Use environment variables in production
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '1h';

@Controller('/api/v1/auth')
export class AuthController {
  @Get('/')
  async getAll() {
    try {
      const users = await getUsers();
      return { success: true, data: users };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, message: 'Internal Server Error.' };
    }
  }

  @Post('/register')
  async register(@Body() body: UserSignupDto) {
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return { success: false, message: 'Email, password, and full name are required.' };
    }

    try {
      const users = await getUsers();

      if (users.some((user) => user.email === email)) {
        return { success: false, message: 'Email already exists.' };
      }

      const hashedPassword = await hashPassword(password);
      const newUser: User = { id: uuidv4(), email, fullName, password: hashedPassword };
      users.push(newUser);

      await saveUsers(users);
      return { success: true, message: 'User created successfully.' };
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, message: 'Internal Server Error.' };
    }
  }

  @Post('/login')
  async login(@Body() body: UserSigninDto) {
    const { email, password } = body;

    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    try {
      const users = await getUsers();
      const user = users.find((u) => u.email === email);

      if (!user || !(await comparePassword(password, user.password))) {
        return { success: false, message: 'Invalid credentials.' };
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

      return { success: true, message: 'Sign-in successful.', token, user };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, message: 'Internal Server Error.' };
    }
  }
}
