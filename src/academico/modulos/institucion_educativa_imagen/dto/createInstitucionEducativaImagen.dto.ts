import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInstitucionEducativaImagenDto {

  @IsNotEmpty({ message: "Debe ingresar el codigo de la InstitucionEducativa" })
  @Transform(({ value }) => parseInt(value))
  institucion_educativa_id: number;

  @IsOptional()
  file: string;

}
