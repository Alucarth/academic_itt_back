import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInstitucionEducativaDto {

  @IsNotEmpty({ message: "Debe ingresar el codigo de la Ubicación Geográfica" })
  @IsNumber()
  jurisdiccion_geografica_id: number;

  @IsNotEmpty({ message: "Debe ingresar el nombre de la Institución Educativa" })
  @IsString()
  institucion_educativa: string;

  @IsNotEmpty({ message: "Debe seleccionar la educación Tipo" })
  @IsNumber()
  educacion_tipo_id: number;

  @IsOptional()
  @IsString()
  observacion: string;

  @IsNotEmpty({ message: "Debe seleccionar el tipo de dependencia" })
  @IsNumber()
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
  @IsNumber()
  sucursal_codigo: number;

  @IsOptional()
  codigo: number;

}
