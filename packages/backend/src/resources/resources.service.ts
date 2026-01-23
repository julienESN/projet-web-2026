import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createHash } from 'crypto';
import {
  CreateResourceDto,
  UpdateResourceDto,
  ResourceQueryDto,
  PaginatedResourceResponse,
  ResourceResponse,
  ResourceType,
  validateResourceContent,
} from 'contracts';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper to format generic Prisma result to ResourceResponse
   */
  private formatResource(resource: any): ResourceResponse {
    return {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type as ResourceType,
      content: resource.content as Record<string, unknown>,
      isFavorite: resource.isFavorite,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
      category: resource.category
        ? {
            id: resource.category.id,
            name: resource.category.name,
            color: resource.category.color,
          }
        : null,
      tags: resource.tags.map((rt: any) => ({
        id: rt.tag.id,
        name: rt.tag.name,
      })),
    };
  }

  /**
   * Create a new resource
   */
  async create(
    userId: string,
    createResourceDto: CreateResourceDto,
  ): Promise<ResourceResponse> {
    // Validate content structure based on type
    try {
      validateResourceContent(
        createResourceDto.type,
        createResourceDto.content,
      );
    } catch (error: any) {
      throw new BadRequestException(
        `Invalid content for type ${createResourceDto.type}: ${error.message}`,
      );
    }

    // Verify category ownership if provided
    if (createResourceDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: createResourceDto.categoryId, userId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createResourceDto.categoryId} not found`,
        );
      }
    }

    // Verify tags ownership if provided
    if (createResourceDto.tagIds && createResourceDto.tagIds.length > 0) {
      const count = await this.prisma.tag.count({
        where: {
          id: { in: createResourceDto.tagIds },
          userId,
        },
      });
      if (count !== createResourceDto.tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    const resource = await this.prisma.resource.create({
      data: {
        userId,
        title: createResourceDto.title,
        description: createResourceDto.description,
        type: createResourceDto.type,
        content: createResourceDto.content as Prisma.JsonObject,
        categoryId: createResourceDto.categoryId,
        tags: createResourceDto.tagIds
          ? {
              create: createResourceDto.tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.formatResource(resource);
  }

  /**
   * Find all resources with filters and pagination
   */
  async findAll(
    userId: string,
    query: ResourceQueryDto,
  ): Promise<PaginatedResourceResponse> {
    const {
      type,
      categoryId,
      tagIds,
      isFavorite,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ResourceWhereInput = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(isFavorite !== undefined && { isFavorite }),
    };

    // Filter by tags (OR logic for now)
    if (tagIds) {
      const tagIdArray = tagIds.split(',').filter(Boolean);
      if (tagIdArray.length > 0) {
        where.tags = {
          some: {
            tagId: { in: tagIdArray },
          },
        };
      }
    }

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute queries transactionally
    const [total, resources] = await this.prisma.$transaction([
      this.prisma.resource.count({ where }),
      this.prisma.resource.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: resources.map(this.formatResource),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one resource by ID
   */
  async findOne(id: string, userId: string): Promise<ResourceResponse> {
    const resource = await this.prisma.resource.findFirst({
      where: { id, userId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return this.formatResource(resource);
  }

  /**
   * Update a resource
   */
  async update(
    id: string,
    userId: string,
    updateResourceDto: UpdateResourceDto,
  ): Promise<ResourceResponse> {
    const existingResource = await this.prisma.resource.findFirst({
      where: { id, userId },
    });

    if (!existingResource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    // Validate content if provided
    if (updateResourceDto.content) {
      try {
        validateResourceContent(
          existingResource.type as ResourceType,
          updateResourceDto.content,
        );
      } catch (error: any) {
        throw new BadRequestException(`Invalid content: ${error.message}`);
      }
    }

    // Prepare tags update
    // For explicit M-N, it's easier to delete all and recreate, or strict diff
    // But Prisma 'set' on nested relations is often easier if we were using implicit M-N.
    // With explicit M-N, we might need deleteMany then create.
    // However, Prisma supports 'deleteMany' and 'create' in update.

    let tagsUpdate: any = undefined;
    if (updateResourceDto.tagIds) {
      // Verify tags
      const count = await this.prisma.tag.count({
        where: {
          id: { in: updateResourceDto.tagIds },
          userId,
        },
      });
      if (count !== updateResourceDto.tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }

      // Replace tags: Delete all existing links for this resource and create new ones
      tagsUpdate = {
        deleteMany: {},
        create: updateResourceDto.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      };
    }

    const resource = await this.prisma.resource.update({
      where: { id },
      data: {
        title: updateResourceDto.title,
        description: updateResourceDto.description,
        content: updateResourceDto.content as Prisma.JsonObject,
        categoryId: updateResourceDto.categoryId,
        isFavorite: updateResourceDto.isFavorite,
        tags: tagsUpdate,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.formatResource(resource);
  }

  /**
   * Delete a resource
   */
  async remove(id: string, userId: string): Promise<void> {
    const existingResource = await this.prisma.resource.findFirst({
      where: { id, userId },
    });

    if (!existingResource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    await this.prisma.resource.delete({
      where: { id },
    });
  }

  async uploadContentFile(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    // Placeholder implementation - in real scenario, upload to cloud storage
    // and return the file URL or identifier.
    const fakeUrl = `https://filestorage.example.com/${encodeURIComponent(
      fileName,
    )}`;
    return fakeUrl;
  }

  /**
   * Upload a file and store it in the database
   * Computes SHA-256 hash to avoid duplicates
   */
  async uploadFile(
    userId: string,
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<{
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    hash: string;
    url: string;
  }> {
    // Calculate SHA-256 hash of the file content
    const hash = createHash('sha256').update(fileBuffer).digest('hex');

    // Check if file with same hash already exists for this user
    const existingFile = await this.prisma.file.findFirst({
      where: {
        hash,
        userId,
      },
    });

    // If file already exists, return existing file info
    if (existingFile) {
      return {
        id: existingFile.id,
        filename: existingFile.filename,
        mimeType: existingFile.mimeType,
        size: existingFile.size,
        hash: existingFile.hash,
        url: `/api/files/${existingFile.id}`,
      };
    }

    // Create new file entry
    const file = await this.prisma.file.create({
      data: {
        userId,
        filename,
        mimeType,
        size: fileBuffer.length,
        hash,
        data: fileBuffer as any,
      },
    });

    return {
      id: file.id,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      hash: file.hash,
      url: `/api/files/${file.id}`,
    };
  }

  /**
   * Get a file by ID
   */
  async getFile(
    fileId: string,
    userId: string,
  ): Promise<{
    filename: string;
    mimeType: string;
    data: Buffer;
  }> {
    const file = await this.prisma.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    return {
      filename: file.filename,
      mimeType: file.mimeType,
      data: Buffer.from(file.data),
    };
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.prisma.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    await this.prisma.file.delete({
      where: { id: fileId },
    });
  }
}
