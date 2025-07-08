import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        example: 'Crema de dientes',
        description: 'Nombre completo del producto',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 100,
        description: 'Precio del producto',
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;
}
