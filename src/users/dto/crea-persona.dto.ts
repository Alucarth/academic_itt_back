
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreaPersonaDTO{

    ci : string;
    
    complemento: string;

    tipoCarnet: number;

    fechanacimiento: string;

    nombres: string;

    paterno: string;

    materno: string;

    generoTipoId : number;

    estadoCivilTipoId: number;

    maternoIdiomaTipoId: number;

    sangreTipoId: number;

    expedidoUnidadTerritorialId : number;

    nacimientoUnidadTerritorialId: number;

    expedido: string;

    tieneDiscapacidad: boolean;

    dobleNacionalidad: boolean;



}