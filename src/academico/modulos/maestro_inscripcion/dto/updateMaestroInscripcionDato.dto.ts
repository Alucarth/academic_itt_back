import {
    IsBoolean,
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from "class-validator";
  
  export class UpdateMaestroInscripcionDatoDto {
    
    @IsNumber()
    id: number;
  
    @IsNotEmpty({ message: "la formacion es requerida" })
    @IsNumber()
    formacionTipoId: number;
  
    @IsNotEmpty({ message: "el financiamiento es requerido" })
    @IsNumber()
    financiamientoTipoId: number;
  
    @IsNotEmpty({ message: "el cargo es requerido" })
    @IsNumber()
    cargoTipoId: number;
  
    @IsOptional({ message: "la especialidad es requerida" })
    @IsNumber()
    especialidadTipoId: number;
  
    @IsNotEmpty({ message: "normalista es requerido" })
    @IsBoolean()
    normalista: boolean;
  
    @IsOptional()
    @IsBoolean()
    vigente: boolean;
  
    @IsOptional()
    @IsString()
    formacionDescripcion: string;
  
    @IsOptional()
    @IsBoolean()
    braile: boolean;
  
    @IsOptional()
    @IsNumber()
    estudioIdiomaTipoId: number;
  
    @IsOptional()
    @IsDateString()
    asignacionFechaInicio: string;
  
    @IsOptional()
    @IsDateString()
    asignacionFechaFin: string;
  
    @IsOptional()
    item: string;
    
  }
  