import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    resource: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findFirst: jest.fn(),
    },
    tag: {
      count: jest.fn(),
    },
    $transaction: jest.fn((args) => args),
  };

  // Mock data with valid UUIDs
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockResourceId = '550e8400-e29b-41d4-a716-446655440001';
  const mockCategoryId = '550e8400-e29b-41d4-a716-446655440002';
  const mockTagId = '550e8400-e29b-41d4-a716-446655440003';

  // Raw Prisma response format
  const mockDbResource = {
    id: mockResourceId,
    title: 'Test Resource',
    type: 'link',
    content: { url: 'https://example.com' },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: mockCategoryId,
      name: 'Work',
      color: '#3B82F6',
    },
    tags: [
      {
        tag: {
          id: mockTagId,
          name: 'important',
        },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated resources', async () => {
      mockPrismaService.resource.count.mockResolvedValue(1);
      mockPrismaService.resource.findMany.mockResolvedValue([mockDbResource]);
      // Mock $transaction behavior
      mockPrismaService.$transaction.mockResolvedValue([1, [mockDbResource]]);

      const result = await service.findAll(mockUserId, {});

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(mockResourceId);
      expect(result.data[0].tags[0].name).toBe('important');
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('create', () => {
    const createDto = {
      title: 'New Resource',
      type: 'link' as const,
      content: { url: 'https://google.com' },
      categoryId: mockCategoryId,
      tagIds: [mockTagId],
    };

    it('should create a resource with dependencies', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue({
        id: mockCategoryId,
      });
      mockPrismaService.tag.count.mockResolvedValue(1); // 1 tag found
      mockPrismaService.resource.create.mockResolvedValue({
        ...mockDbResource,
        title: 'New Resource',
      });

      const result = await service.create(mockUserId, createDto);

      expect(result.title).toBe('New Resource');
      expect(prisma.resource.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid content', async () => {
      const invalidDto = {
        ...createDto,
        content: { invalid: 'content' },
      };

      await expect(service.create(mockUserId, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      mockPrismaService.resource.findFirst.mockResolvedValue(mockDbResource);
      mockPrismaService.resource.update.mockResolvedValue({
        ...mockDbResource,
        title: 'Updated Title',
      });

      const result = await service.update(mockResourceId, mockUserId, {
        title: 'Updated Title',
      });

      expect(result.title).toBe('Updated Title');
    });
  });

  describe('remove', () => {
    it('should delete a resource', async () => {
      mockPrismaService.resource.findFirst.mockResolvedValue(mockDbResource);
      mockPrismaService.resource.delete.mockResolvedValue(mockDbResource);

      await service.remove(mockResourceId, mockUserId);

      expect(prisma.resource.delete).toHaveBeenCalledWith({
        where: { id: mockResourceId },
      });
    });
  });
});
