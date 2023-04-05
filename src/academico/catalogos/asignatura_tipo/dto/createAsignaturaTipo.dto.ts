import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateAsignaturaTipoDto {
  @IsNotEmpty({
    message: "asignatura is required",
  })
  asignatura: string;

  abreviacion: string;

  comentario: string;  
  
}
