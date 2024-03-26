import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatriculaEstudiante } from "src/academico/entidades/matriculaEstudiante.entity";
import { MatriculaEstudianteArchivo } from "src/academico/entidades/matriculaEstudianteArchivo.entity";
import { DatabaseModule } from "src/database/database.module";
import { MatriculaEstudianteController } from "./matricula_estudiante.controller";
import { MatriculaEstudianteService } from "./matricula_estudiante.service";

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([MatriculaEstudiante, MatriculaEstudianteArchivo])],
    controllers: [MatriculaEstudianteController],
    providers: [ MatriculaEstudianteService ],
    exports: [MatriculaEstudianteService]
})
export class MaestroEstudianteModule {}