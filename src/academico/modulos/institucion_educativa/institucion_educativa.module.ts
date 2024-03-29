import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { InstitucionEducativaController } from './institucion_educativa.controller';
import { InstitucionEducativaService } from './institucion_educativa.service';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { InstitucionEducativaRepository } from './institucion_educativa.repository';
import { InstitucionEducativaAcreditacionRepository } from '../institucion_educativa_acreditacion/institucion_educativa_acreditacion.repository';
import { InstitucionEducativaSucursalRepository } from '../institucion_educativa_sucursal/institucion_educativa_sucursal.repository';
import { MatriculaEstudianteService } from '../mantricula_estudiante/matricula_estudiante.service';
import { institucionEducativaEstudianteProviders } from '../Institucion_educativa_estudiante/institucion_educativa_estudiante.providers';
import { InstitucionEducativaEstudianteService } from '../Institucion_educativa_estudiante/institucion_educativa_estudiante.services';
import { InstitucionEducativaImagenRepository } from '../institucion_educativa_imagen/institucion_educativa_imagen.repository';
import { InstitucionEducativaImagenService } from '../institucion_educativa_imagen/institucion_educativa_imagen.service';
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { TblAuxiliarSie } from 'src/academico/entidades/tblAuxiliarSie';
import { JurisdiccionGeografica } from 'src/academico/entidades/jurisdiccionGeografica.entity';
import { InstitucionEducativaAcreditacion } from 'src/academico/entidades/institucionEducativaAcreditacion.entity';
import { MatriculaEstudiante } from 'src/academico/entidades/matriculaEstudiante.entity';




@Module({
  imports: [
    DatabaseModule, 
    TypeOrmModule.forFeature([InstitucionEducativa, MatriculaEstudiante ,InstitucionEducativaSucursal, CarreraAutorizada, MaestroInscripcion,JurisdiccionGeografica,InstitucionEducativaAcreditacion]),
    TypeOrmModule.forFeature([TblAuxiliarSie], "siedb"),
  ],
  controllers: [InstitucionEducativaController],
  providers: [
    InstitucionEducativaService, 
    InstitucionEducativaRepository, 
    RespuestaSigedService,
    InstitucionEducativaAcreditacionRepository,
    InstitucionEducativaSucursalRepository,
    InstitucionEducativaImagenRepository,
    InstitucionEducativaImagenService,
    ...institucionEducativaEstudianteProviders,
    InstitucionEducativaEstudianteService,
    
  ]
})
export class InstitucionEducativaModule {}
