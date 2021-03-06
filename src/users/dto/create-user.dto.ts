import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Email do usuário' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Senha do Usuário' })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string;

    @ApiProperty({ description: 'Nome completo do usuário' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Define se o usuário é administrador',
        default: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    admin: boolean;
}
