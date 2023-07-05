import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInstitucionEducativaDto {

  @IsNotEmpty({ message: "Debe ingresar el codigo de la Ubicación Geográfica" })
 // @IsString()
  @Transform(({ value }) => parseInt(value))
  jurisdiccion_geografica_id: number;

  @IsNotEmpty({ message: "Debe ingresar el nombre de la Institución Educativa" })
  @IsString()
  institucion_educativa: string;

  @IsNotEmpty({ message: "Debe seleccionar la educación Tipo" })
  //@IsString()
  @Transform(({ value }) => parseInt(value))
  educacion_tipo_id: number;

  @IsOptional()
  @IsString()
  observacion: string;

  @IsNotEmpty({ message: "Debe seleccionar el tipo de dependencia" })
  //@IsString()
  @Transform(({ value }) => parseInt(value))
  dependencia_tipo_id: number;

  @IsOptional({ message: "Debe ingresar la fecha de resolución" })
  @IsString()
  fecha_resolucion: string;

  @IsOptional({ message: "Debe ingresar el número de resolución" })
  @IsString()
  numero_resolucion: string;

  @IsOptional()
  @IsString()
  sucursal_nombre: string;

  @IsOptional()
  //@IsString()
  @Transform(({ value }) => parseInt(value))
  sucursal_codigo: number;

  @IsOptional()
  codigo: number;

  @IsOptional()
  file: string;

}
