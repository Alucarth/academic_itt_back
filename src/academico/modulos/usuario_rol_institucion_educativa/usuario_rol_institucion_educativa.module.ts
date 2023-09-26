import { Module } from "@nestjs/common";
import { UsuarioRolInsitucionEducativaController } from "./usuario_rol_institucion_educativa.controller";
import { DatabaseModule } from "src/database/database.module";
import { usuarioRolInstitucionEducativaProviders } from "./usuario_rol_institucion_educativa.providers";
import { UsuarioRolInstitucionEducativaService } from "./usuario_rol_institucion_educativa.service";

@Module({
    controllers: [UsuarioRolInsitucionEducativaController],
    imports: [DatabaseModule],
    providers: [...usuarioRolInstitucionEducativaProviders, UsuarioRolInstitucionEducativaService]
})
export class UsuarioRolInstitucionEducativaModule{}