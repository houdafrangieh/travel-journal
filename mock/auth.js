import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const SECRET = 'red'; // for Token
const FILE = path.resolve('mock/users.json');

// Ensure users.json exists
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]');

function readUsers() {
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

function writeUsers(users) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

export default [
  {
    url: '/api/signup',
    method: 'post',
    response: ({ body }) => {
      const { email, password } = body;
      const users = readUsers();

      // Validate fields
      if (!email || !password) {
        return { code: 400, message: 'Email and password are required' };
      }

      if (!isValidEmail(email)) {
        return { code: 400, message: 'Invalid email format' };
      }

      if (!isValidPassword(password)) {
        return { code: 400, message: 'Password must be at least 6 characters' };
      }

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        return { code: 400, message: 'User already exists' };
      }

      const newUser = { id: Date.now(), email, password };
      users.push(newUser);
      writeUsers(users);

      return { code: 200, message: 'Signup successful' };
    },
  },
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { email, password } = body;
      const users = readUsers();

      // Validate fields
      if (!email || !password) {
        return { code: 400, message: 'Email and password are required' };
      }

      if (!isValidEmail(email)) {
        return { code: 400, message: 'Invalid email format' };
      }

      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) return { code: 401, message: 'Invalid credentials' };

      const token = jwt.sign({ id: user.id, email }, SECRET, {
        expiresIn: '1h',
      });

      return { code: 200, message: 'Login successful', token };
    },
  },
  {
    url: '/api',
    method: 'get',
    response: () => {
      return { code: 200, message: 'API Running' };
    },
  },
];
