import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import {
    CreateTagDto,
    CreateTagDtoSchema,
    TagResponseSchema,
} from 'contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { strict as assert } from 'node:assert';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    /**
     * GET /tags - Get all tags for the authenticated user
     */
    @Get()
    async findAll(
        @GetUser() user: { userId: string },
        @Query('search') search?: string,
    ) {
        const tags = await this.tagsService.findAll(user.userId, search);
        return {
            data: tags.map((tag) => TagResponseSchema.parse(tag)),
        };
    }

    /**
     * GET /tags/:id - Get a tag by ID
     */
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @GetUser() user: { userId: string },
    ) {
        const tag = await this.tagsService.findOne(id, user.userId);
        assert(tag, new Error('Tag not found'));
        return TagResponseSchema.parse(tag);
    }

    /**
     * POST /tags - Create a new tag
     */
    @Post()
    async create(
        @Body() createTagDto: CreateTagDto,
        @GetUser() user: { userId: string },
    ) {
        const parsedDto = CreateTagDtoSchema.parse(createTagDto);
        assert(parsedDto, new Error('Invalid tag data'));

        const tag = await this.tagsService.create(user.userId, parsedDto);
        assert(tag, new Error('Failed to create tag'));

        return TagResponseSchema.parse(tag);
    }

    /**
     * DELETE /tags/:id - Delete a tag
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id') id: string,
        @GetUser() user: { userId: string },
    ) {
        await this.tagsService.remove(id, user.userId);
    }
}
