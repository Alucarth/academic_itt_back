import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePlanEstudioCarreraDto {
   
    @IsNotEmpty({ message: " id resolucion es requerido" })
    @IsNumber()
    plan_estudio_resolucion_id: number;

    @IsNotEmpty({ message: " id carrera es requerido" })
    @IsNumber()
    carrera_tipo_id: number;

    @IsNotEmpty({ message: " id area es requerido" })
    @IsNumber()
    nivel_academico_tipo_id: number;

    @IsNotEmpty({ message: " id area es requerido" })
    @IsNumber()
    area_tipo_id: number;

    @IsNotEmpty({ message: " id regimen de estudio es requerido" })
    @IsNumber()
    intervalo_gestion_tipo_id: number;

    @IsNotEmpty({ message: " el tiempo de estudio es requerido" })
    @IsNumber()
    tiempo_estudio: number;

    @IsNotEmpty({ message: " la carga horaria  es requerido" })
    @IsNumber()
    carga_horaria: number;

    @IsNotEmpty({ message: " denominacion es requerido" })
    @IsString()
    denominacion: string;

    @IsOptional({ message: " mencion es opcional" })
    @IsString()
    descripcion: string;
   
}

export class UpdatePlanEstudioCarreraDto {
    @IsNotEmpty({ message: " denominacion es requerido" })
    @IsString()
    denominacion: string;

    @IsOptional({ message: " mencion es opcional" })
    @IsString()
    descripcion: string;
}