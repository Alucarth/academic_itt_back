import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateOperativoEtapaEducativaDto {
  
 
  @IsNotEmpty({ message: "la Gestion es requerido" })
  @IsNumber()
  gestionTipoId: number;

  
  @IsNotEmpty({ message: "el evemto es Requerido" })
  @IsNumber()
  eventoTipoId: number;

  
  @IsNotEmpty({ message: "el evemto es Requerido" })
  @IsNumber()
  educacionTipoId: number;

  
  @IsNotEmpty({ message: "Periodo tipo es requerido" })
  @IsNumber()
  periodoTipoId: number;

  
  @IsNotEmpty({ message: "la Etapa Educativa es requerido" })
  @IsNumber()
  etapaEducativaId: number;

  
  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

  @IsOptional()
  fechaInicio:string; 

  @IsOptional()
  fechaFin:string; 

  @IsOptional()
  observacion:string; 
}

function JsonProperty() {
    throw new Error('Function not implemented.');
}
