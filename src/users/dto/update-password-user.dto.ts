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

export class UpdatePasswordUserDto {  

  @IsOptional()
  @IsNumber()
  id: number;


  @IsString()
  @MinLength(4)
  @MaxLength(20)
  /*@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })*/
  password: string;
 

}


export const Respuesta = {  
  codigoEstado: 0,
  estado: false,
  mensaje: "",
  error: {}
}