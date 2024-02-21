import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewUserDto{
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsNumber()
    personaId: number;

    @IsNotEmpty()
    @IsBoolean()
    activo: boolean;
    


}
