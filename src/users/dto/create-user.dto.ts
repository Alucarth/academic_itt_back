import {  
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {  

  @IsOptional()
  @IsNumber()
  id: number;

   @IsOptional()
  @IsNotEmpty({
    message: 'Username is required',
  })
  username: string;

   @IsOptional()
  @IsString({
    message: 'Email must be a string',
  })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  /*@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })*/
  password: string;

  @IsString()
  @IsNotEmpty({
    message: 'Role is required',
  })
  role: string;

  @IsNotEmpty({
    message: 'ci is required',
  })
  carnet: string;

  @IsString()
  complemento: string;

  @IsNumber()
  tipoCarnet: number;

  @IsString()
  fechaNacimiento: string;

  @IsString()
  nombres: string;
  
  @IsString()
  paterno: string;
  
  @IsString()
  materno: string;
 
  @IsNumber()
  generoTipoId : number;

  @IsNumber()
  estadoCivilTipoId: number;
 
  @IsNumber()
  maternoIdiomaTipoId: number;
 
  @IsNumber()
  sangreTipoId: number;

  @IsNumber()
  expedidoUnidadTerritorialId : number;
 
  @IsNumber()
  nacimientoUnidadTerritorialId: number;
  
  @IsString()
  expedido: string;

  @IsBoolean()
  tieneDiscapacidad: boolean;

  @IsBoolean()
  dobleNacionalidad: boolean;

}


export const Respuesta = {  
  codigoEstado: 0,
  estado: false,
  mensaje: "",
  error: {}
}