import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { InstitucionEducativaModule } from './academico/modulos/institucion_educativa/institucion_educativa.module';
import { EducacionTipoModule } from './academico/catalogos/educacion_tipo/educacion_tipo.module';
import { InstitucionEducativaAcreditacionEspecialidadModule } from './academico/modulos/institucion_educativa_acreditacion_especialidad/institucion_educativa_acreditacion_especialidad.module';
import { EspecialidadTipoModule } from './academico/catalogos/especialidad_tipo/especialidad_tipo.module';
import { AsignaturaTipoModule } from './academico/catalogos/asignatura_tipo/asignatura_tipo.module';
import { EtapaEducativaModule } from './academico/modulos/etapa_educativa/etapa_educativa.module';
import { EtapaEducativaAsignaturaModule } from './academico/modulos/etapa_educativa_asignatura/etapa_educativa_asignatura.module';
import { InstitucionEducativaSucursalModule } from './academico/modulos/institucion_educativa_sucursal/institucion_educativa_sucursal.module';
import { InstitucionEducativaAcreditacionEtapaEducativaModule } from './academico/modulos/institucion_educativa_acreditacion_etapa_educativa/institucion_educativa_acreditacion_etapa_educativa.module';
import { GeneroTipoModule } from './academico/catalogos/genero_tipo/genero_tipo.module';
import { EstadoCivilTipoModule } from './academico/catalogos/estado_civil_tipo/estado_civil_tipo.module';
import { SangreTipoModule } from './academico/catalogos/sangre_tipo/sangre_tipo.module';
import { IdiomaTipoModule } from './academico/catalogos/idioma_tipo/idioma_tipo.module';
import { SegipTipoModule } from './academico/catalogos/segip_tipo/segip_tipo.module';
import { AreaGeograficaTipoModule } from './academico/catalogos/area_geografica_tipo/area_geografica_tipo.module';
import { CensoTipoModule } from './academico/catalogos/censo_tipo/censo_tipo.module';
import { UnidadTerritorialTipoModule } from './academico/catalogos/unidad_territorial_tipo/unidad_territorial_tipo.module';
import { OperativoModule } from './academico/modulos/operativo/operativo.module';
import { GestionTipoModule } from './academico/catalogos/gestion_tipo/gestion_tipo.module';
import { TurnoTipoModule } from './academico/catalogos/turno_tipo/turno_tipo.module';
import { ParaleloTipoModule } from './academico/catalogos/paralelo_tipo/paralelo_tipo.module';
import { InstitucionEducativaCursoModule } from './academico/modulos/institucion_educativa_curso/institucion_educativa_curso.module';
import { PeriodoTipoModule } from './academico/catalogos/periodo_tipo/periodo_tipo.module';
import { OperativoEtapaEducativaModule } from './academico/modulos/operativo_etapa_educativa/operativo_etapa_educativa.module';
import { OfertaAcademicaModule } from './academico/modulos/oferta_academica/oferta_academica.module';
import { EstudianteInscripcionModule } from './academico/modulos/estudiante_inscripcion/estudiante_inscripcion.module';
import { PersonaModule } from './academico/modulos/persona/persona.module';

import { MaestroInscripcionModule } from './academico/modulos/maestro_inscripcion/maestro_inscripcion.module';
import { EstudianteInscripcionOfertaAcademicaModule } from './academico/modulos/estudiante_inscripcion_oferta_academica/estudiante_inscripcion_oferta_academica.module';

import { FormacionTipoModule } from './academico/catalogos/formacion_tipo/formacion_tipo.module';
import { FinanciamientoTipoModule } from './academico/catalogos/financiamiento_tipo/financiamiento_tipo.module';
import { CargoTipoModule } from './academico/catalogos/cargo_tipo/cargo_tipo.module';
import { MallaCurricularModule } from './academico/modulos/malla-curricular/malla-curricular.module';
import { config } from './config';
//import { ConfigService } from "@nestjs/config";
import { DatabaseConfig } from './database.config';
import { OfertaAcademicaMaestroInscripcionModule } from './academico/modulos/oferta_academica_maestro_inscripcion/oferta_academica_maestro_inscripcion.module';

import { UnidadTerritorialModule } from './academico/modulos/unidad_territorial/unidad_territorial.module';
import { JurisdiccionGeograficaModule } from './academico/modulos/jurisdiccion_geografica/jurisdiccion_geografica.module';

import { SegipModule } from './segip/segip.module';
import { LoggerMiddleware } from './utils/logger.middleware';
import { ConvenioTipoModule } from './academico/catalogos/convenio_tipo/convenio_tipo.module';
import { DependenciaTipoModule } from './academico/catalogos/dependencia_tipo/dependencia_tipo.module';
import { InstitucionEducativaAcreditacionModule } from './academico/modulos/institucion_educativa_acreditacion/institucion_educativa_acreditacion.module';
import { NivelAcademicoTipoModule } from './academico/catalogos/nivel_academico_tipo/nivel_academico_tipo.module';
import { CampoSaberTipoModule } from './academico/catalogos/campo_saber_tipo/campo_saber_tipo.module';
import { IntervaloGestionTipoModule } from './academico/catalogos/intervalo_gestion_tipo/intervalo_gestion_tipo.module';
import { TiempoEstudioTipoModule } from './academico/catalogos/tiempo_estudio_tipo/tiempo_estudio_tipo.module';
import { AreaTipoModule } from './academico/catalogos/area_tipo/area_tipo.module';
import { CarreraTipoModule } from './academico/catalogos/carrera_tipo/carrera_tipo.module';
import { ResolucionTipoModule } from './academico/catalogos/resolucion_tipo/resolucion_tipo.module';
import { CarreraAutorizadaResolucionModule } from './academico/modulos/carrera_autorizada_resolucion/carrera_autorizada_resolucion.module';
import { PlanEstudioResolucionModule } from './academico/modulos/plan_estudio_resolucion/plan_estudio_resolucion.module';
import { PlanEstudioCarreraModule } from './academico/modulos/plan_estudio_carrera/plan_estudio_carrera.module';
import { PlanEstudioAsignaturaModule } from './academico/modulos/plan_estudio_asignatura/plan_estudio_asignatura.module';
import { CarreraAutorizadaModule } from './academico/modulos/carrera_autorizada/carrera_autorizada.module';
import { InstitutoPlanEstudioCarreraModule } from './academico/modulos/instituto_plan_estudio_carrera/instituto_plan_estudio_carrera.module';
import { InscripcionModule } from './academico/modulos/inscripcion/inscripcion.module';
import { RegimenGradoTipoModule } from './academico/catalogos/regimen_grado_tipo/regimen_grado_tipo.module';
import { OperativoCarreraAutorizadaModule } from './academico/modulos/operativo_carrera_autorizada/operativo_carrera_autorizada.module';
import { OfertaCurricularModule } from './academico/modulos/oferta_curricular/oferta_curricular.module';
import { AulaModule } from './academico/modulos/aula/aula.module';
import { DiaTipoModule } from './academico/catalogos/dia_tipo/dia_tipo.module';
import { AulaDetalleModule } from './academico/modulos/aula_detalle/aula_detalle.module';
import { NotaTipoModule } from './academico/catalogos/nota_tipo/nota_tipo.module';
import { ValoracionTipoModule } from './academico/catalogos/valoracion_tipo/valoracion_tipo.module';
import { InstitutoEstudianteInscripcionDocenteCalificacionModule } from './academico/modulos/instituto_estudiante_inscripcion_docente_calificacion/instituto_estudiante_inscripcion_docente_calificacion.module';
import { AulaDocenteModule } from './academico/modulos/aula_docente/aula_docente.module';
import { PlanEstudioAsignaturaReglaModule } from './academico/modulos/plan_estudio_asignatura_regla/plan_estudio_asignatura_regla.module';
import { EventoTipoModule } from './academico/catalogos/evento_tipo/evento_tipo.module';
import { ModalidadEvaluacionTipoModule } from './academico/catalogos/modalidad_evaluacion_tipo/modalidad_evaluacion_tipo.module';

import { TblAuxiliarSie } from "./academico/entidades/tblAuxiliarSie";
import { MulterModule } from '@nestjs/platform-express';
import { InstitucionEducativaImagenModule } from './academico/modulos/institucion_educativa_imagen/institucion_educativa_imagen.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

//multiple bases
const defaultOptions = {
  type: 'postgres',
  host: process.env.DB_HOST, //'100.0.101.7',
  port: parseInt(process.env.DB_PORT), //5436,
  username: process.env.DB_USER,//'dcastillo', 
  database: process.env.DATABASE, 
  password: process.env.DB_PASSWORD,
  synchronize: false,
};

const defaultOptionsSie = {
  type: 'postgres',
  host: process.env.DBSIE_HOST, 
  port: parseInt(process.env.DBSIE_PORT),
  username:  process.env.DBSIE_USER, 
  database: process.env.DATABASESIE, 
  password: process.env.DBSIE_PASSWORD, 
  synchronize: false,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    //TypeOrmModule.forRoot(typeOrmConfig),
    /*TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),*/

    TypeOrmModule.forRoot({
      ...defaultOptions,     
      entities: ['dist/**/*.entity.js'],
    } as any),
    TypeOrmModule.forRoot({
      ...defaultOptionsSie,      
      name: 'siedb',
      entities: [TblAuxiliarSie],
    } as any),
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    InstitucionEducativaModule,
    EducacionTipoModule,
    InstitucionEducativaAcreditacionEspecialidadModule,
    EspecialidadTipoModule,
    AsignaturaTipoModule,
    EtapaEducativaModule,
    EtapaEducativaAsignaturaModule,
    InstitucionEducativaSucursalModule,
    InstitucionEducativaAcreditacionEtapaEducativaModule,
    GeneroTipoModule,
    EstadoCivilTipoModule,
    SangreTipoModule,
    IdiomaTipoModule,
    SegipTipoModule,
    AreaGeograficaTipoModule,
    CensoTipoModule,
    UnidadTerritorialTipoModule,
    UnidadTerritorialModule,
    OperativoModule,
    GestionTipoModule,
    TurnoTipoModule,
    ParaleloTipoModule,
    InstitucionEducativaCursoModule,
    PeriodoTipoModule,
    OperativoEtapaEducativaModule,
    OfertaAcademicaModule,
    EstudianteInscripcionModule,
    PersonaModule,
    MaestroInscripcionModule,
    EstudianteInscripcionOfertaAcademicaModule,
    FormacionTipoModule,
    FinanciamientoTipoModule,
    CargoTipoModule,
    MallaCurricularModule,
    OfertaAcademicaMaestroInscripcionModule,

    JurisdiccionGeograficaModule,

    SegipModule,

    ConvenioTipoModule,

    DependenciaTipoModule,

    InstitucionEducativaAcreditacionModule,

    NivelAcademicoTipoModule,

    CampoSaberTipoModule,

    IntervaloGestionTipoModule,

    TiempoEstudioTipoModule,

    AreaTipoModule,

    CarreraTipoModule,

    ResolucionTipoModule,

    CarreraAutorizadaResolucionModule,

    PlanEstudioResolucionModule,

    PlanEstudioCarreraModule,

    PlanEstudioAsignaturaModule,

    CarreraAutorizadaModule,

    InstitutoPlanEstudioCarreraModule,

    InscripcionModule,

    RegimenGradoTipoModule,

    OperativoCarreraAutorizadaModule,

    OfertaCurricularModule,

    AulaModule,

    DiaTipoModule,

    AulaDetalleModule,

    NotaTipoModule,

    ValoracionTipoModule,

    InstitutoEstudianteInscripcionDocenteCalificacionModule,

    AulaDocenteModule,

    PlanEstudioAsignaturaReglaModule,

    EventoTipoModule,

    ModalidadEvaluacionTipoModule,

    InstitucionEducativaImagenModule,

  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

}
