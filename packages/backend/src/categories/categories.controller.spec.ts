import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponse } from 'contracts';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { userId: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
  const mockCategory: CategoryResponse = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Work',
    color: '#3B82F6',
    createdAt: new Date(),
    _count: { resources: 5 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([mockCategory]);

      const result = await controller.findAll(mockUser);

      expect(result.data).toHaveLength(1);
      expect(categoriesService.findAll).toHaveBeenCalledWith(mockUser.userId);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne('550e8400-e29b-41d4-a716-446655440001', mockUser);

      expect(result.name).toBe('Work');
      expect(categoriesService.findOne).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001', mockUser.userId);
    });
  });

  describe('create', () => {
    const createDto: CreateCategoryDto = {
      name: 'Personal',
      color: '#10B981',
    };

    it('should create a new category', async () => {
      const newCategory: CategoryResponse = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: createDto.name,
        color: createDto.color!,
        createdAt: new Date(),
      };
      mockCategoriesService.create.mockResolvedValue(newCategory);

      const result = await controller.create(createDto, mockUser);

      expect(result.name).toBe(createDto.name);
      expect(categoriesService.create).toHaveBeenCalledWith(mockUser.userId, createDto);
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidDto = {
        name: '', // Empty name not allowed
        color: 'invalid-color', // Invalid hex format
      };

      await expect(controller.create(invalidDto as any, mockUser)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateDto: UpdateCategoryDto = {
      name: 'Updated Name',
    };

    it('should update a category', async () => {
      const updatedCategory: CategoryResponse = {
        ...mockCategory,
        name: 'Updated Name',
      };
      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update('550e8400-e29b-41d4-a716-446655440001', updateDto, mockUser);

      expect(result.name).toBe('Updated Name');
      expect(categoriesService.update).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001', mockUser.userId, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockCategoriesService.remove.mockResolvedValue(undefined);

      await controller.remove('550e8400-e29b-41d4-a716-446655440001', mockUser);

      expect(categoriesService.remove).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001', mockUser.userId);
    });
  });
});
