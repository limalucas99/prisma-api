import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { JwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
    constructor(private readonly repository: UsersRepository) {}

    public async createAccessToken(userId: string): Promise<string> {
        return sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
    }

    public async validateUser(jwtPayload: JwtPayload): Promise<UserEntity> {
        const user = await this.repository.findOne(+jwtPayload.userId);
        if (!user) {
            throw new NotFoundError('User not found!');
        }
        return user;
    }

    private static jwtExtractor(request: Request): string {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new BadRequestException('Token not found in headers');
        }

        const [, token] = authHeader.split(' ');

        return token;
    }

    public returnJwtExtractor(): (request: Request) => string {
        return AuthService.jwtExtractor;
    }
}
