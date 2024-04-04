import { InstitucionEducativaHistorialService } from './institucion_educativa_historial.service';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InstitucionEducativaHistorial } from "src/academico/entidades/institucionEducativaHistorial.entity";
import { DatabaseModule } from "src/database/database.module";
import { InstitucionEducativaHistorialController } from "./institucion_educativa_historial.controller";
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { InstitucionEducativaAcreditacion } from 'src/academico/entidades/institucionEducativaAcreditacion.entity';

@Module({
    imports:[DatabaseModule, TypeOrmModule.forFeature([InstitucionEducativaHistorial, InstitucionEducativa, InstitucionEducativaAcreditacion])],
    controllers: [ InstitucionEducativaHistorialController],
    providers: [ InstitucionEducativaHistorialService ]
})
export class InstitucionEducativaHistorialModcule {}