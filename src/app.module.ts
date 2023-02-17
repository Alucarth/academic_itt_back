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
  ],
  providers: [EducacionTipoService],
})
export class AppModule {}
