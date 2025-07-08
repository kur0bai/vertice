import {
    IsArray,
    ValidateNested,
    IsMongoId,
    IsInt,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderProductDto {
    @ApiProperty({ example: '64f2a6d5eaf34e001e4a67ff', description: 'ID del producto' })
    @IsMongoId()
    product: string;

    @ApiProperty({ example: 2, description: 'Cantidad del producto' })
    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({
        type: [OrderProductDto],
        description: 'Lista de productos con cantidad',
        example: [
            { product: '64f2a6d5eaf34e001e4a67ff', quantity: 2 },
            { product: '64f2a6d5eaf34e001e4a6800', quantity: 1 },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderProductDto)
    products: OrderProductDto[];
}
