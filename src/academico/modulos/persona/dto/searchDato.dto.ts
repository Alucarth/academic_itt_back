import { IsNotEmpty, IsString } from "class-validator";

export class SearchDatoDto{

    @IsNotEmpty()
    @IsString()
    carnetIdentidad: string;

    @IsString()
    complemento: string;
       
}