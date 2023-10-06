import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EstadoInstituto } from "src/academico/entidades/estadoInstituto.entity";
import { DatabaseModule } from "src/database/database.module";
import { EstadoInstitutoController } from "./estado_instituto.controller";
import { EstadoInsitutoService } from "./estado_instituto.service";

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([EstadoInstituto])],
    controllers: [EstadoInstitutoController],
    providers: [EstadoInsitutoService]
})

export class EstadoInstitutoModule { }