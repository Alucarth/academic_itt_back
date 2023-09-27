import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsuarioRolService } from "./usuario_rol.service";
import { UsuarioRol } from "src/academico/entidades/usuarioRol.entity";

@ApiTags('usuario_rol')
@Controller('usuario_rol')
export class UsuarioRolController{
    constructor(
        private readonly usuarioRolService: UsuarioRolService
    ){}

    @Get()
    async getAll(): Promise<UsuarioRol[]>{
        return this.usuarioRolService.findAll()
    }
}