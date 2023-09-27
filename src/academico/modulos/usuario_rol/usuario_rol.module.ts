import { Module } from "@nestjs/common";
import { UsuarioRolController } from "./usuario_rol.controller";
import { DatabaseModule } from "src/database/database.module";
import { usuarioRolProviders } from "./usuario_rol.providers";
import { UsuarioRolService } from "./usuario_rol.service";

@Module({
    controllers: [UsuarioRolController],
    imports: [DatabaseModule],
    providers: [...usuarioRolProviders, UsuarioRolService],
    exports: [UsuarioRolService]
})
export class UsuarioRolModule{}