import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InscripcionTipo } from "src/academico/entidades/inscripcionTipo.entity";
import { InscripcionTipoService } from "./inscripcion_tipo.service";
import { InscripcionTipoController } from "./inscripcion_tipo.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([InscripcionTipo])
    ],
    controllers: [InscripcionTipoController],
    providers:[ InscripcionTipoService]
})
export class InscripcionTipoModule {}