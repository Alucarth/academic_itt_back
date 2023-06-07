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
import { UpdateCarreraAutorizadaResolucionDto } from "./updateCarreraAutorizadaResolucion.dto";
  
  export class CreateCarreraAutorizadaResolucionDto extends UpdateCarreraAutorizadaResolucionDto {
    @IsNotEmpty({ message: "la Institucion educativa requerido" })
    @IsNumber()
    sucursal_id: number;
  
    @IsNotEmpty({ message: "la carrera es requerida" })
    @IsNumber()
    carrera_tipo_id: number;
    
    @IsNotEmpty({ message: "el tipo de resoluciona es requerido" })
    @IsNumber()
    area_tipo_id: number;

    
  }
  