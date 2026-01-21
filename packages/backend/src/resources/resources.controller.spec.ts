import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { CreateResourceDto, ResourceResponse } from 'contracts';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let service: ResourcesService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
  };
  const mockResourceId = '550e8400-e29b-41d4-a716-446655440001';

  const mockResource: ResourceResponse = {
    id: mockResourceId,
    title: 'Test Resource',
    description: null,
    type: 'link',
    content: { url: 'https://example.com' },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: null,
    tags: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        {
          provide: ResourcesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    service = module.get<ResourcesService>(ResourcesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated resources', async () => {
      const mockResult = {
        data: [mockResource],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };
      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockUser, {});

      expect(result).toBe(mockResult);
    });
  });

  describe('create', () => {
    const createDto: CreateResourceDto = {
      title: 'New Resource',
      type: 'link',
      content: { url: 'https://test.com' },
    };

    it('should create a resource', async () => {
      mockService.create.mockResolvedValue({
        ...mockResource,
        title: createDto.title,
      });

      const result = await controller.create(createDto, mockUser);

      expect(result.title).toBe(createDto.title);
      expect(service.create).toHaveBeenCalled();
    });

    it('should throw validation error for bad input', async () => {
      const invalidDto: any = {
        title: '', // Invalid empty title
        type: 'link',
        content: {}, // Invalid content for link
      };

      await expect(controller.create(invalidDto, mockUser)).rejects.toThrow();
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status', async () => {
      mockService.findOne.mockResolvedValue(mockResource); // currently false
      mockService.update.mockResolvedValue({
        ...mockResource,
        isFavorite: true,
      });

      const result = await controller.toggleFavorite(mockResourceId, mockUser);

      expect(result.isFavorite).toBe(true);
      expect(service.update).toHaveBeenCalledWith(
        mockResourceId,
        mockUser.userId,
        { isFavorite: true },
      );
    });
  });
});
