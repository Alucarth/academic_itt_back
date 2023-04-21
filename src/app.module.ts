import { Module } from '@nestjs/common';
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
import { UnidadTerritorialModule } from './academico/catalogos/unidad_territorial/unidad_territorial.module';
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
import { ConfigService } from "@nestjs/config";
import { DatabaseConfig } from './database.config';
import { OfertaAcademicaMaestroInscripcionModule } from './academico/modulos/oferta_academica_maestro_inscripcion/oferta_academica_maestro_inscripcion.module';
import { SegipModule } from './segip/segip.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    //TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
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
    SegipModule,
  ],
  providers: [],
})
export class AppModule {}
