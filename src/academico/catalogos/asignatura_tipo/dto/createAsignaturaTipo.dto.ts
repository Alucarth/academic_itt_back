import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";

export class CreateAsignaturaTipoDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty({
    message: "asignatura is required",
  })
  asignatura: string;

  @IsOptional()
  abreviacion: string;

  @IsOptional()
  comentario: string;
}
