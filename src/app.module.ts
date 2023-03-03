import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { InstitucionEducativaModule } from './academico/modulos/institucion_educativa/institucion_educativa.module';
import { EducacionTipoService } from './academico/catalogos/educacion_tipo/educacion_tipo.service';
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

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
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
  ],
  providers: [EducacionTipoService],
})
export class AppModule {}
