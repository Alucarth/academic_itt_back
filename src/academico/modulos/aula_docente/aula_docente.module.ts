import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaDocenteController } from './aula_docente.controller';
import { AulaDocenteRepository } from './aula_docente.repository';
import { AulaDocenteService } from './aula_docente.service';
import { Aula } from 'src/academico/entidades/aula.entity';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';

@Module({
  imports: [DatabaseModule, 
    TypeOrmModule.forFeature([AulaDocente, Aula,MaestroInscripcion]),
  ],
  controllers: [AulaDocenteController],
  providers: [AulaDocenteService, 
  RespuestaSigedService, 
  AulaDocenteRepository, 
  AulaDocenteRepository]
})
export class AulaDocenteModule {}
