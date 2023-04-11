import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class DeleteEtapaEducativaAsignaturaDto {


  @IsNotEmpty({ message: "identificador es requerido" })
  @IsNumber()
  @IsPositive()
  @IsNotIn([0])
  id: number;

}
