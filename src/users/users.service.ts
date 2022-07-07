import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
// import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';

@Injectable()
export class UsersService {
    constructor(
        private readonly repository: UsersRepository,
        private readonly authService: AuthService,
    ) {}
    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.repository.create(createUserDto);
    }

    public async login(
        loginUserDto: LoginUserDto,
    ): Promise<{ name: string; jwtToken: string; email: string }> {
        const user = await this.findByEmail(loginUserDto.email);
        const match = await this.checkPassword(loginUserDto.password, user);
        if (!match) {
            throw new UnauthorizedError('Invalid Credentials');
        }

        const jwtToken = await this.authService.createAccessToken(
            String(user.id),
        );

        return { name: user.name, jwtToken, email: user.email };
    }

    private async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new NotFoundError('Usuario não encontrado');
        }
        return user;
    }

    private async checkPassword(
        password: string,
        user: UserEntity,
    ): Promise<boolean> {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new NotFoundError('Password not found');
        }
        return match;
    }

    findAll() {
        // throw new UnauthorizedError('Não autorizado!');
        return this.repository.findAll();
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.repository.findOne(id);
        if (!user) {
            throw new NotFoundError('Usuario não encontrado');
        }
        return user;
    }

    update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        return this.repository.update(id, updateUserDto);
    }

    remove(id: number): Promise<UserEntity> {
        return this.repository.remove(id);
    }
}
