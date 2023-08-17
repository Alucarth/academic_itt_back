import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateJurisdiccionGeograficaDto {

  @IsNotEmpty({ message: "Cordenada X" })
  @IsNumber()
  cordx: number;

  @IsNotEmpty({ message: "Cordenada Y" })
  @IsNumber()
  cordy: number;
/*
  @IsOptional()
  @IsString()
  direccion: string;

  @IsOptional()
  @IsString()
  zona: string;

  @IsOptional()
  @IsString()
  observacion: string;*/
    
}
