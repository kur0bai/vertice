import { IsArray, IsMongoId, ArrayNotEmpty } from 'class-validator';

export class CreateOrderDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    productIds: string[];
}
