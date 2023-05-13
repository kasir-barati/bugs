import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateContactUsDto {
    @ApiProperty({
        // TODO: 320 is hard coded in the contact-us entity too
        minLength: 2,
        maxLength: 320,
        description: "User's full name",
        required: true,
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(2)
    @MaxLength(320)
    name: string;

    @ApiProperty({
        description: "User's email address",
        required: true,
    })
    @IsEmail()
    @Transform(({ value }) => value.trim())
    email: string;

    @ApiProperty({
        // TODO: 2000 is hard coded in the contact-us entity too
        minLength: 30,
        maxLength: 2000,
        description: "User's message to us",
        required: true,
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(30)
    @MaxLength(2000)
    message: string;
}
