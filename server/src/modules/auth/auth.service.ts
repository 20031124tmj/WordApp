import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Db } from '../../database/connection';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export class AuthService {
  constructor(private db: Db) {}

  async register(email: string, password: string, nickname: string) {
    const existing = await this.db('users').where({ email }).first();
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await this.db('users').insert({ id, email, password_hash: passwordHash, nickname });

    const tokens = this.generateTokens(id);
    return { user: { id, email, nickname }, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.db('users').where({ email }).first();
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(user.id);
    return {
      user: { id: user.id, email: user.email, nickname: user.nickname },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; type: string };
      if (payload.type !== 'refresh') {
        throw new Error('INVALID_TOKEN');
      }
      const user = await this.db('users').where({ id: payload.userId }).first();
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }
      const tokens = this.generateTokens(user.id);
      return {
        user: { id: user.id, email: user.email, nickname: user.nickname },
        ...tokens,
      };
    } catch {
      throw new Error('INVALID_TOKEN');
    }
  }

  async getUserById(userId: string) {
    const user = await this.db('users').where({ id: userId }).first();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      daily_goal: user.daily_goal,
      timezone: user.timezone,
    };
  }

  private generateTokens(userId: string) {
    const access_token = jwt.sign({ userId, type: 'access' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });
    const refresh_token = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN as any,
    });
    return { access_token, refresh_token };
  }
}
