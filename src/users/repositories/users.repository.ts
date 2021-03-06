import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: createUserDto,
            include: {
                posts: {
                    select: {
                        title: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    async findAll(): Promise<UserEntity[]> {
        return this.prisma.user.findMany({
            include: {
                posts: {
                    select: {
                        title: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    async findOne(id: number): Promise<UserEntity> {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                posts: {
                    select: {
                        title: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async update(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: updateUserDto,
            include: {
                posts: {
                    select: {
                        title: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    async remove(id: number): Promise<UserEntity> {
        return this.prisma.user.delete({
            where: {
                id,
            },
        });
    }
}
