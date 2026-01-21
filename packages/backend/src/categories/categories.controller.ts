import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
    CreateCategoryDto,
    UpdateCategoryDto,
    CreateCategoryDtoSchema,
    UpdateCategoryDtoSchema,
    CategoryResponseSchema,
} from 'contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { strict as assert } from 'node:assert';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    /**
     * GET /categories - Get all categories for the authenticated user
     */
    @Get()
    async findAll(@GetUser() user: { userId: string }) {
        const categories = await this.categoriesService.findAll(user.userId);
        return {
            data: categories.map((cat) => CategoryResponseSchema.parse(cat)),
        };
    }

    /**
     * GET /categories/:id - Get a category by ID
     */
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @GetUser() user: { userId: string },
    ) {
        const category = await this.categoriesService.findOne(id, user.userId);
        assert(category, new Error('Category not found'));
        return CategoryResponseSchema.parse(category);
    }

    /**
     * POST /categories - Create a new category
     */
    @Post()
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @GetUser() user: { userId: string },
    ) {
        const parsedDto = CreateCategoryDtoSchema.parse(createCategoryDto);
        assert(parsedDto, new Error('Invalid category data'));

        const category = await this.categoriesService.create(user.userId, parsedDto);
        assert(category, new Error('Failed to create category'));

        return CategoryResponseSchema.parse(category);
    }

    /**
     * PUT /categories/:id - Update a category
     */
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @GetUser() user: { userId: string },
    ) {
        const parsedDto = UpdateCategoryDtoSchema.parse(updateCategoryDto);
        assert(parsedDto, new Error('Invalid update data'));

        const category = await this.categoriesService.update(id, user.userId, parsedDto);
        assert(category, new Error('Failed to update category'));

        return CategoryResponseSchema.parse(category);
    }

    /**
     * DELETE /categories/:id - Delete a category
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id') id: string,
        @GetUser() user: { userId: string },
    ) {
        await this.categoriesService.remove(id, user.userId);
    }
}
