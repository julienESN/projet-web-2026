import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = {
      username: 'test@example.com',
      password: 'password123',
    };

    it('should return an access token for valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mock_token');

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'mock_token' });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.username },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    const registerDto = {
      username: 'newuser',
      password: 'password123',
      email: 'test@example.com',
    };

    it('should register a new user and return an access token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const newUser = {
        id: '1',
        email: registerDto.email,
        name: registerDto.username,
      };
      mockPrismaService.user.create.mockResolvedValue(newUser);
      mockJwtService.signAsync.mockResolvedValue('mock_token');

      const result = await service.register(registerDto);

      expect(result).toEqual({ access_token: 'mock_token' });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          name: registerDto.username,
          password: 'hashedPassword',
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getMe', () => {
    it('should return user profile', async () => {
      const now = new Date();
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'testuser',
        password: 'hashedPassword',
        createdAt: now,
        updatedAt: now,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getMe('1');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'testuser',
        createdAt: now,
        updatedAt: now,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('1')).rejects.toThrow(UnauthorizedException);
    });
  });
});
