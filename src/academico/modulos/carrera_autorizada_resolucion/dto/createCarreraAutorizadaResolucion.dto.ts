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
  
  export class CreateCarreraAutorizadaResolucionDto {
    @IsNotEmpty({ message: "la Institucion educativa requerido" })
    @IsNumber()
    sucursal_id: number;
  
    @IsNotEmpty({ message: "la carrera es requerida" })
    @IsNumber()
    carrera_tipo_id: number;
    
    @IsNotEmpty({ message: "el tipo de resoluciona es requerido" })
    @IsNumber()
    area_tipo_id: number;

    @IsNotEmpty({ message: "el area es requerida" })
    @IsNumber()
    resolucion_tipo_id: number;


    @IsNotEmpty({ message: "el numero de resolucion es requerida" })
    @IsString()
    numero_resolucion: string;

    @IsNotEmpty({ message: "la fecha de resolucion es requerida" })
    @IsString()
    fecha_resolucion: string;
    
    @IsOptional()
    descripcion: string;

    @IsOptional()
    resuelve: string;

    @IsNotEmpty({ message: "la cargaHoraria es requerida" })
    @IsNumber()
    @IsPositive()
    @IsNotIn([0])
    carga_horaria: number;

    
    @IsNotEmpty({ message: "el tiempo de estudio es requerida" })
    @IsNumber()
    @IsPositive()
    @IsNotIn([0])
    tiempo_estudio: number;
  
    @IsNotEmpty({ message: "el intervaloTiempoTipoId es requerido" })
    @IsNumber()
    intervalo_gestion_tipo_id: number;

    @IsNotEmpty({ message: "el nivel Academico es requerido" })
    @IsNumber()
    nivel_academico_tipo_id: number;
  
    
  }
  