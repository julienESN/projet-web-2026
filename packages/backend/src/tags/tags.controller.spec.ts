import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { CreateTagDto, TagResponse } from 'contracts';

describe('TagsController', () => {
  let controller: TagsController;
  let tagsService: TagsService;

  const mockTagsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { userId: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
  const mockTag: TagResponse = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'productivity',
    createdAt: new Date(),
    _count: { resources: 3 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    tagsService = module.get<TagsService>(TagsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      mockTagsService.findAll.mockResolvedValue([mockTag]);

      const result = await controller.findAll(mockUser);

      expect(result.data).toHaveLength(1);
      expect(tagsService.findAll).toHaveBeenCalledWith(mockUser.userId, undefined);
    });

    it('should pass search query to service', async () => {
      mockTagsService.findAll.mockResolvedValue([mockTag]);

      await controller.findAll(mockUser, 'prod');

      expect(tagsService.findAll).toHaveBeenCalledWith(mockUser.userId, 'prod');
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      mockTagsService.findOne.mockResolvedValue(mockTag);

      const result = await controller.findOne(mockTag.id, mockUser);

      expect(result.name).toBe('productivity');
      expect(tagsService.findOne).toHaveBeenCalledWith(mockTag.id, mockUser.userId);
    });
  });

  describe('create', () => {
    const createDto: CreateTagDto = { name: 'Important' };

    it('should create a new tag', async () => {
      const newTag: TagResponse = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'important',
        createdAt: new Date(),
      };
      mockTagsService.create.mockResolvedValue(newTag);

      const result = await controller.create(createDto, mockUser);

      expect(result.name).toBe('important');
      expect(tagsService.create).toHaveBeenCalled();
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidDto = { name: '' }; // Empty name not allowed

      await expect(controller.create(invalidDto as any, mockUser)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a tag', async () => {
      mockTagsService.remove.mockResolvedValue(undefined);

      await controller.remove(mockTag.id, mockUser);

      expect(tagsService.remove).toHaveBeenCalledWith(mockTag.id, mockUser.userId);
    });
  });
});
