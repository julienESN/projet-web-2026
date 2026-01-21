import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponse } from 'contracts';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all categories for a user
     */
    async findAll(userId: string): Promise<CategoryResponse[]> {
        const categories = await this.prisma.category.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { resources: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return categories;
    }

    /**
     * Get category by ID
     */
    async findOne(id: string, userId: string): Promise<CategoryResponse> {
        const category = await this.prisma.category.findFirst({
            where: { id, userId },
            include: {
                _count: {
                    select: { resources: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    /**
     * Create a new category
     */
    async create(userId: string, createCategoryDto: CreateCategoryDto): Promise<CategoryResponse> {
        // Check if category with same name already exists for this user
        const existingCategory = await this.prisma.category.findFirst({
            where: {
                userId,
                name: createCategoryDto.name,
            },
        });

        if (existingCategory) {
            throw new ConflictException('A category with this name already exists');
        }

        const category = await this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                color: createCategoryDto.color || null,
                userId,
            },
            include: {
                _count: {
                    select: { resources: true },
                },
            },
        });

        return category;
    }

    /**
     * Update a category
     */
    async update(
        id: string,
        userId: string,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<CategoryResponse> {
        // Check if category exists and belongs to user
        const existingCategory = await this.prisma.category.findFirst({
            where: { id, userId },
        });

        if (!existingCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Check if new name already exists for this user (if name is being updated)
        if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
            const nameExists = await this.prisma.category.findFirst({
                where: {
                    userId,
                    name: updateCategoryDto.name,
                    NOT: { id },
                },
            });
            if (nameExists) {
                throw new ConflictException('A category with this name already exists');
            }
        }

        const category = await this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            include: {
                _count: {
                    select: { resources: true },
                },
            },
        });

        return category;
    }

    /**
     * Delete a category
     */
    async remove(id: string, userId: string): Promise<void> {
        // Check if category exists and belongs to user
        const existingCategory = await this.prisma.category.findFirst({
            where: { id, userId },
        });

        if (!existingCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        await this.prisma.category.delete({
            where: { id },
        });
    }
}
