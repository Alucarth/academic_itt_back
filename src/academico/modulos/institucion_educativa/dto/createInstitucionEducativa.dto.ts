import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInstitucionEducativaDto {

  @IsNotEmpty({ message: "Debe ingresar el codigo de la Ubicación Geográfica" })
  @IsNumber()
  jurisdiccionGeograficaId: number;

  @IsNotEmpty({ message: "Debe ingresar el nombre de la Institución Educativa" })
  @IsString()
  institucionEducativa: string;

  @IsNotEmpty({ message: "Debe seleccionar la educación Tipo" })
  @IsNumber()
  educacionTipoId: number;

  @IsOptional()
  @IsString()
  observacion: string;

  @IsNotEmpty({ message: "Debe seleccionar el tipo de convenio" })
  @IsNumber()
  convenioTipoId: number;

  @IsNotEmpty({ message: "Debe seleccionar el tipo de dependencia" })
  @IsNumber()
  dependenciaTipoId: number;

  @IsOptional({ message: "Debe ingresar la fecha de resolución" })
  @IsString()
  fechaResolucion: string;

  @IsOptional({ message: "Debe ingresar el número de resolución" })
  @IsString()
  numeroResolucion: string;

  @IsOptional()
  @IsString()
  sucursalNombre: string;

  @IsOptional()
  @IsNumber()
  sucursalCodigo: number;

  @IsOptional()
  codigo: number;


}
