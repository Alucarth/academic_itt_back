import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  isNumber,
} from "class-validator";

export class CreateAsignaturaTipoDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty({
    message: "asignatura is required",
  })
  asignatura: string;

  @IsString()
  abreviacion: string;

  @IsOptional()
  comentario: string;
}
