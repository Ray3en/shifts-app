import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import type { AuthUser, LoginInput, LoginResponse } from '@mono/shared';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const login = this.config.get('ADMIN_LOGIN', 'admin');
    const password = this.config.get('ADMIN_PASSWORD', 'admin');
    const existing = await this.users.findOne({ where: { login } });

    if (!existing) {
      await this.users.save(
        this.users.create({ login, passwordHash: await hash(password, 12) }),
      );
    }
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.login = :login', { login: input.login })
      .getOne();

    if (!user || !(await compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const publicUser: AuthUser = { id: user.id, login: user.login };
    return {
      data: {
        accessToken: await this.jwt.signAsync({ sub: user.id, login: user.login }),
        user: publicUser,
      },
    };
  }
}
