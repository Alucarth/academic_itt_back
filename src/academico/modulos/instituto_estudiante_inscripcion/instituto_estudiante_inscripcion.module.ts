
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseModule } from "src/database/database.module";
import { InstitutoEstudianteInscripcionService } from "./instituto_estudiante_inscripcion.service";
import { InstitutoEstudianteInscripcionArchivo } from "src/academico/entidades/institutoEstudianteInscripcionArchivo.entity";
import { InstitutoEstudianteInscripcion } from "src/academico/entidades/InstitutoEstudianteInscripcion.entity";
import { InstitutoEstudianteInscripcionController } from "./instituto_estudiante_inscripcion.controller";

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([ InstitutoEstudianteInscripcionArchivo, InstitutoEstudianteInscripcion])],
    controllers: [InstitutoEstudianteInscripcionController],
    providers: [InstitutoEstudianteInscripcionService]
})
export class InsitutoEstudianteInscripcionModule {}