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
import { UsersService } from './users.service';
import {
    CreateUserDto,
    UpdateUserDto,
    CreateUserDtoSchema,
    UpdateUserDtoSchema,
    UserProfileSchema,
} from 'contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { strict as assert } from 'node:assert';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * GET /users - Get all users
     */
    @Get()
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map((user) => UserProfileSchema.parse(user));
    }

    /**
     * GET /users/:id - Get user by ID
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        assert(user, new Error('User not found'));
        return UserProfileSchema.parse(user);
    }

    /**
     * POST /users - Create a new user
     */
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const parsedDto = CreateUserDtoSchema.parse(createUserDto);
        assert(parsedDto, new Error('Invalid user data'));

        const user = await this.usersService.create(parsedDto);
        assert(user, new Error('Failed to create user'));

        return UserProfileSchema.parse(user);
    }

    /**
     * PUT /users/:id - Update a user
     */
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const parsedDto = UpdateUserDtoSchema.parse(updateUserDto);
        assert(parsedDto, new Error('Invalid update data'));

        const user = await this.usersService.update(id, parsedDto);
        assert(user, new Error('Failed to update user'));

        return UserProfileSchema.parse(user);
    }

    /**
     * DELETE /users/:id - Delete a user
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.usersService.remove(id);
    }
}
