import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un producto estandar' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const createdProduct = await this.productsService.create(createProductDto);
    return {
      status: 'success',
      message: 'Producto registrado correctamente',
      data: {
        id: createdProduct.id,
        name: createdProduct.name,
        price: createdProduct.price,
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de productos' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

}
