import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRolDto 
{
    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsNotEmpty()
    @IsNumber()
    rolTipoId: number;

}