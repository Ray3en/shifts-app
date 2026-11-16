import { UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';

describe('AuthService business rules', () => {
  const getOne = vi.fn();
  const builder = { addSelect: vi.fn(), where: vi.fn(), getOne };
  builder.addSelect.mockReturnValue(builder);
  builder.where.mockReturnValue(builder);
  const users = {
    findOne: vi.fn(), save: vi.fn(), create: vi.fn((value) => value),
    createQueryBuilder: vi.fn(() => builder),
  };
  const jwt = { signAsync: vi.fn(async () => 'signed-token') };
  const config = { get: vi.fn((_key: string, fallback: string) => fallback) };
  const service = new AuthService(users as never, jwt as never, config as never);

  beforeEach(() => vi.clearAllMocks());

  it('returns a token and never exposes the password hash', async () => {
    getOne.mockResolvedValue({ id: 'user-1', login: 'admin', passwordHash: await hash('admin', 4) });
    const result = await service.login({ login: 'admin', password: 'admin' });
    expect(result).toEqual({ data: { accessToken: 'signed-token', user: { id: 'user-1', login: 'admin' } } });
    expect(result.data.user).not.toHaveProperty('passwordHash');
    expect(jwt.signAsync).toHaveBeenCalledWith({ sub: 'user-1', login: 'admin' });
  });

  it('rejects an invalid password without issuing a token', async () => {
    getOne.mockResolvedValue({ id: 'user-1', login: 'admin', passwordHash: await hash('admin', 4) });
    await expect(service.login({ login: 'admin', password: 'wrong' })).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('creates the configured administrator only when absent', async () => {
    users.findOne.mockResolvedValue(null);
    await service.onModuleInit();
    expect(users.save).toHaveBeenCalledOnce();
    expect(users.create).toHaveBeenCalledWith(expect.objectContaining({ login: 'admin', passwordHash: expect.any(String) }));
  });
});
