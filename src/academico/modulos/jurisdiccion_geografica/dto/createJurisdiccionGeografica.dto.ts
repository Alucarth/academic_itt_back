import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJurisdiccionGeograficaDto {

  @IsOptional({ message: "Debe ingresar el distrito" })
  @IsNumber()
  distritoUnidadTerritorialId: number;

  @IsOptional({ message: "Debe ingresar la localidad segun censo 2001" })
  @IsNumber()
  localidadUnidadTerritorial2001Id: number;

  @IsNotEmpty({ message: "Debe ingresar la localidad segun censo 2012" })
  @IsNumber()
  localidadUnidadTerritorial2012Id: number;

  @IsNotEmpty({ message: "Cordenada X" })
  @IsNumber()
  cordx: number;

  @IsNotEmpty({ message: "Cordenada Y" })
  @IsNumber()
  cordy: number;

  @IsNotEmpty({ message: "el Tipo de Acreditación es requerido" })
  @IsNumber()
  acreditacionTipoId: number;

  @IsNotEmpty({ message: "la validación es requerido" })
  @IsNumber()
  jurisdiccionValidacionTipoId: number;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  zona: string;

  @IsOptional()
  @IsString()
  observacion: string;

  @IsOptional()
  codigo: number;

}
