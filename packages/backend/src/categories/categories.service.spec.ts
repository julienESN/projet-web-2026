import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    category: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUserId = 'user-123';
  const mockCategory = {
    id: 'cat-1',
    name: 'Work',
    color: '#3B82F6',
    createdAt: new Date(),
    userId: mockUserId,
    _count: { resources: 5 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([mockCategory]);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: { _count: { select: { resources: true } } },
        orderBy: { name: 'asc' },
      });
    });

    it('should return empty array when no categories exist', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);

      const result = await service.findOne('cat-1', mockUserId);

      expect(result).toEqual(mockCategory);
      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: 'cat-1', userId: mockUserId },
        include: { _count: { select: { resources: true } } },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createDto = { name: 'Personal', color: '#10B981' };

    it('should create a new category', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);
      mockPrismaService.category.create.mockResolvedValue({
        id: 'cat-2',
        ...createDto,
        createdAt: new Date(),
        userId: mockUserId,
        _count: { resources: 0 },
      });

      const result = await service.create(mockUserId, createDto);

      expect(result.name).toBe(createDto.name);
      expect(prisma.category.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if name already exists', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    const updateDto = { name: 'Updated Name' };

    it('should update a category', async () => {
      mockPrismaService.category.findFirst
        .mockResolvedValueOnce(mockCategory) // Category exists
        .mockResolvedValueOnce(null); // No duplicate name
      mockPrismaService.category.update.mockResolvedValue({
        ...mockCategory,
        name: 'Updated Name',
      });

      const result = await service.update('cat-1', mockUserId, updateDto);

      expect(result.name).toBe('Updated Name');
      expect(prisma.category.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', mockUserId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when updating to existing name', async () => {
      mockPrismaService.category.findFirst
        .mockResolvedValueOnce(mockCategory) // Category exists
        .mockResolvedValueOnce({ id: 'cat-other' }); // Name exists

      await expect(
        service.update('cat-1', mockUserId, { name: 'Existing Name' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.category.delete.mockResolvedValue(mockCategory);

      await service.remove('cat-1', mockUserId);

      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.remove('invalid-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
