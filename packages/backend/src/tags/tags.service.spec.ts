import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    tag: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockTag = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'productivity',
    createdAt: new Date(),
    userId: mockUserId,
    _count: { resources: 3 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tags for a user', async () => {
      mockPrismaService.tag.findMany.mockResolvedValue([mockTag]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([mockTag]);
      expect(prisma.tag.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: { _count: { select: { resources: true } } },
        orderBy: { name: 'asc' },
      });
    });

    it('should filter tags by search term', async () => {
      mockPrismaService.tag.findMany.mockResolvedValue([mockTag]);

      await service.findAll(mockUserId, 'prod');

      expect(prisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          name: { contains: 'prod', mode: 'insensitive' },
        },
        include: { _count: { select: { resources: true } } },
        orderBy: { name: 'asc' },
      });
    });

    it('should return empty array when no tags exist', async () => {
      mockPrismaService.tag.findMany.mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      mockPrismaService.tag.findFirst.mockResolvedValue(mockTag);

      const result = await service.findOne(mockTag.id, mockUserId);

      expect(result).toEqual(mockTag);
    });

    it('should throw NotFoundException when tag not found', async () => {
      mockPrismaService.tag.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('invalid-id', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = { name: 'Important' };

    it('should create a new tag with normalized name', async () => {
      mockPrismaService.tag.findFirst.mockResolvedValue(null);
      mockPrismaService.tag.create.mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'important',
        createdAt: new Date(),
        userId: mockUserId,
        _count: { resources: 0 },
      });

      const result = await service.create(mockUserId, createDto);

      expect(result.name).toBe('important');
      expect(prisma.tag.create).toHaveBeenCalledWith({
        data: { name: 'important', userId: mockUserId },
        include: { _count: { select: { resources: true } } },
      });
    });

    it('should throw ConflictException if name already exists', async () => {
      mockPrismaService.tag.findFirst.mockResolvedValue(mockTag);

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a tag', async () => {
      mockPrismaService.tag.findFirst.mockResolvedValue(mockTag);
      mockPrismaService.tag.delete.mockResolvedValue(mockTag);

      await service.remove(mockTag.id, mockUserId);

      expect(prisma.tag.delete).toHaveBeenCalledWith({
        where: { id: mockTag.id },
      });
    });

    it('should throw NotFoundException when tag not found', async () => {
      mockPrismaService.tag.findFirst.mockResolvedValue(null);

      await expect(service.remove('invalid-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
