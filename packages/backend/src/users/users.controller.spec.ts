import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserProfile } from 'contracts';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserProfile: UserProfile = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUserProfile]);

      const result = await controller.findAll();

      expect(result).toEqual([mockUserProfile]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUserProfile);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUserProfile);
      expect(usersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
    };

    it('should create a new user', async () => {
      const newUser: UserProfile = {
        id: '2',
        email: createUserDto.email,
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.create.mockResolvedValue(newUser);

      const result = await controller.create(createUserDto);

      expect(result.email).toBe(createUserDto.email);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidDto = {
        email: 'invalid-email',
        password: '123', // < 6 characters
        name: 'A', // < 2 characters
      };

      await expect(controller.create(invalidDto as any)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };

    it('should update a user', async () => {
      const updatedUser: UserProfile = {
        ...mockUserProfile,
        name: 'Updated Name',
      };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(result.name).toBe('Updated Name');
      expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw ZodError for invalid email format', async () => {
      const invalidDto = {
        email: 'not-an-email',
      };

      await expect(controller.update('1', invalidDto as any)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(usersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
