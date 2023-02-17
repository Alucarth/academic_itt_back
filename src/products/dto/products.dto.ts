import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {

  @IsString({ message: "el campo es un texto" })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsString({ message: "el campo es un texto" })
  @IsNotEmpty({
    message: 'Product SKU is required',
  })
  SKU: string;

  @IsString({ message: "el campo es un texto" })
  @IsNotEmpty({
    message: 'Product Description is required',
  })
  description: string;

  @IsString({ message: "el campo es un texto" })
  @IsNotEmpty({
    message: 'Product Price is required',
  })
  price: string;
}
