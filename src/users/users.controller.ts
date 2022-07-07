import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiResponse({ status: 409, description: 'Conflito de Email' })
    @ApiForbiddenResponse({ description: 'Acesso Negado' })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    public async login(
        @Body() loginUserDto: LoginUserDto,
    ): Promise<{ name: string; jwtToken: string; email: string }> {
        return this.usersService.login(loginUserDto);
    }

    // @ApiForbiddenResponse({ description: 'Acesso Negado' })
    // @Get()
    // findAll() {
    //     return this.usersService.findAll();
    // }

    @ApiForbiddenResponse({ description: 'Acesso Negado' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @ApiForbiddenResponse({ description: 'Acesso Negado' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @ApiForbiddenResponse({ description: 'Acesso Negado' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    public async findAll(): Promise<UserEntity[]> {
        return await this.usersService.findAll();
    }
}
