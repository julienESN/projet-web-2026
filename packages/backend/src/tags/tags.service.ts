import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, TagResponse } from 'contracts';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all tags for a user
     */
    async findAll(userId: string, search?: string): Promise<TagResponse[]> {
        const tags = await this.prisma.tag.findMany({
            where: {
                userId,
                ...(search && {
                    name: {
                        contains: search.toLowerCase(),
                        mode: 'insensitive' as const,
                    },
                }),
            },
            include: {
                _count: {
                    select: { resources: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return tags;
    }

    /**
     * Get tag by ID
     */
    async findOne(id: string, userId: string): Promise<TagResponse> {
        const tag = await this.prisma.tag.findFirst({
            where: { id, userId },
            include: {
                _count: {
                    select: { resources: true },
                },
            },
        });

        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        return tag;
    }

    /**
     * Create a new tag
     */
    async create(userId: string, createTagDto: CreateTagDto): Promise<TagResponse> {
        const normalizedName = createTagDto.name.toLowerCase().trim();

        // Check if tag with same name already exists for this user
        const existingTag = await this.prisma.tag.findFirst({
            where: {
                userId,
                name: normalizedName,
            },
        });

        if (existingTag) {
            throw new ConflictException('A tag with this name already exists');
        }

        const tag = await this.prisma.tag.create({
            data: {
                name: normalizedName,
                userId,
            },
            include: {
                _count: {
                    select: { resources: true },
                },
            },
        });

        return tag;
    }

    /**
     * Delete a tag
     */
    async remove(id: string, userId: string): Promise<void> {
        // Check if tag exists and belongs to user
        const existingTag = await this.prisma.tag.findFirst({
            where: { id, userId },
        });

        if (!existingTag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        await this.prisma.tag.delete({
            where: { id },
        });
    }
}
