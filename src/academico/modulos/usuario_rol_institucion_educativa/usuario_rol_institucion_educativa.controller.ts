import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsuarioRolInstitucionEducativaService } from "./usuario_rol_institucion_educativa.service";
import { UsuarioRolInstitucionEducativa } from "src/academico/entidades/usuarioRolInsituticionEducativa.entity";

@ApiTags('usuario_rol_institucion_educativa')
@Controller('usuario_rol_institucion_educativa')
export class UsuarioRolInsitucionEducativaController{
    constructor(private readonly _usuarioRolInstitucionEducativa: UsuarioRolInstitucionEducativaService)
    {}
    @Get()
    async findAll(): Promise<UsuarioRolInstitucionEducativa[]>{
        return this._usuarioRolInstitucionEducativa.findAll()
    }
}