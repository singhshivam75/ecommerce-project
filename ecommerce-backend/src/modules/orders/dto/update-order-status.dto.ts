import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'shipped',
    enum: ['pending', 'shipped', 'delivered'],
  })
  @IsIn(['pending', 'shipped', 'delivered'])
  status!: 'pending' | 'shipped' | 'delivered';
}