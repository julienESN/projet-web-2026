import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponse, UserProfile } from 'contracts';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    getMe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result: AuthResponse = {
        access_token: 'mock_token',
      };

      mockAuthService.login.mockReturnValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error for invalid input', () => {
      const invalidDto = {
        username: 'te',
        password: '123',
      };

      expect(() => controller.login(invalidDto as any)).toThrow();
    });
  });

  describe('register', () => {
    it('should register a new user and return an access token', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        password: 'password123',
        email: 'test@example.com',
      };
      const result: AuthResponse = {
        access_token: 'mock_token',
      };

      mockAuthService.register.mockReturnValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an error for invalid input', () => {
      const invalidDto = {
        username: 'te',
        password: '123',
        email: 'invalid-email',
      };

      expect(() => controller.register(invalidDto as any)).toThrow();
    });
  });

  describe('getMe', () => {
    it('should return user profile', async () => {
      const user = { userId: '1', email: 'test@example.com' };
      const userProfile: UserProfile = {
        id: '1',
        email: 'test@example.com',
        name: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.getMe.mockReturnValue(userProfile);

      expect(await controller.getMe(user)).toEqual(userProfile);
      expect(mockAuthService.getMe).toHaveBeenCalledWith(user.userId);
    });
  });
});
