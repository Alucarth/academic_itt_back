import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArchivoTipo } from "src/academico/entidades/archivoTipo.entity";
import { DatabaseModule } from "src/database/database.module";
import { ArchivoTipoController } from "./archivo_tipo.controller";
import { ArchivoTipoService } from "./archivo_tipo.service";

@Module({
    imports: [DatabaseModule,TypeOrmModule.forFeature([ArchivoTipo])],
    controllers: [ArchivoTipoController],
    providers: [ArchivoTipoService]
})
export class ArchivoTipoModule{}