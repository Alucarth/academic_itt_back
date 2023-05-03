import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateJurisdiccionGeograficaDto {

  @IsNotEmpty({ message: "Cordenada X" })
  @IsNumber()
  cordx: number;

  @IsNotEmpty({ message: "Cordenada Y" })
  @IsNumber()
  cordy: number;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  zona: string;

  @IsOptional()
  @IsString()
  observacion: string;
    
}
