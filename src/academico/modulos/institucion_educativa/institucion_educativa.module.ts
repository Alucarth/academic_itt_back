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
import { matriculaProviders } from '../mantricula_estudiante/matricula_estudiante.providers';
import { MatriculaEstudianteService } from '../mantricula_estudiante/matricula_estudiante.service';
import { institucionEducativaEstudianteProviders } from '../Institucion_educativa_estudiante/institucion_educativa_estudiante.providers';
import { InstitucionEducativaEstudianteService } from '../Institucion_educativa_estudiante/institucion_educativa_estudiante.services';



@Module({
  imports: [
    DatabaseModule, 
    TypeOrmModule.forFeature([InstitucionEducativa])
  ],
  controllers: [InstitucionEducativaController],
  providers: [
    InstitucionEducativaService, 
    InstitucionEducativaRepository, 
    RespuestaSigedService,
    InstitucionEducativaAcreditacionRepository,
    InstitucionEducativaSucursalRepository,
    ...matriculaProviders,
    MatriculaEstudianteService,
    ...institucionEducativaEstudianteProviders,
    InstitucionEducativaEstudianteService,
    
  ]
})
export class InstitucionEducativaModule {}
