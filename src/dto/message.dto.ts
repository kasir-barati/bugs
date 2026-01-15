import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsISO8601 } from 'class-validator';

export class MessageDto {
  @ApiProperty({
    description: 'Event name or type',
    example: 'user.created',
  })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({
    description: 'Event payload with any structure',
    example: { userId: 123, name: 'John Doe', email: 'john@example.com' },
  })
  @IsObject()
  @IsNotEmpty()
  value: Record<string, any>;

  @ApiProperty({
    description: 'ISO 8601 timestamp',
    example: '2026-01-15T11:30:27.327Z',
  })
  @IsISO8601()
  @IsNotEmpty()
  timestamp: string;
}
