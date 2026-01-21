import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import {
  CreateResourceDto,
  CreateResourceDtoSchema,
  UpdateResourceDto,
  UpdateResourceDtoSchema,
  ResourceQueryDtoSchema,
  ResourceResponseSchema,
} from 'contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { strict as assert } from 'node:assert';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  /**
   * GET /resources
   * List resources with filters and pagination
   */
  @Get()
  async findAll(@GetUser() user: { userId: string }, @Query() query: any) {
    // Manually convert numbers/booleans for query generic object before parsing?
    // Zod's coerce should handle strings from query params
    const parsedQuery = ResourceQueryDtoSchema.parse(query);

    const result = await this.resourcesService.findAll(
      user.userId,
      parsedQuery,
    );

    // Validate output? (Optional overhead, but good for strictness)
    // For list endpoints, we might skip full Zod parse on every item for performance if confident
    // But let's keep it safe initially.
    // However, PaginatedResourceResponse logic is in service, let's just return result.
    return result;
  }

  /**
   * GET /resources/:id
   * Get single resource
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: { userId: string }) {
    const resource = await this.resourcesService.findOne(id, user.userId);
    assert(resource, new Error('Resource not found'));
    return ResourceResponseSchema.parse(resource);
  }

  /**
   * POST /resources
   * Create resource
   */
  @Post()
  async create(
    @Body() createResourceDto: CreateResourceDto,
    @GetUser() user: { userId: string },
  ) {
    const parsedDto = CreateResourceDtoSchema.parse(createResourceDto);
    assert(parsedDto, new Error('Invalid resource data'));

    const resource = await this.resourcesService.create(user.userId, parsedDto);
    assert(resource, new Error('Failed to create resource'));

    return ResourceResponseSchema.parse(resource);
  }

  /**
   * PUT /resources/:id
   * Update resource
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @GetUser() user: { userId: string },
  ) {
    const parsedDto = UpdateResourceDtoSchema.parse(updateResourceDto);
    assert(parsedDto, new Error('Invalid update data'));

    const resource = await this.resourcesService.update(
      id,
      user.userId,
      parsedDto,
    );
    assert(resource, new Error('Failed to update resource'));

    return ResourceResponseSchema.parse(resource);
  }

  /**
   * DELETE /resources/:id
   * Delete resource
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @GetUser() user: { userId: string }) {
    await this.resourcesService.remove(id, user.userId);
  }

  /**
   * PATCH /resources/:id/favorite
   * Toggle favorite status
   */
  @Patch(':id/favorite')
  async toggleFavorite(
    @Param('id') id: string,
    @GetUser() user: { userId: string },
  ) {
    // First get current status
    const resource = await this.resourcesService.findOne(id, user.userId);
    // Toggle
    const updated = await this.resourcesService.update(id, user.userId, {
      isFavorite: !resource.isFavorite,
    });

    return {
      id: updated.id,
      isFavorite: updated.isFavorite,
    };
  }
}
