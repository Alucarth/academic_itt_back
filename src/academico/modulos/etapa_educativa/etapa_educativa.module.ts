import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaEducativa } from 'src/academico/entidades/etapaEducativa.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EtapaEducativaController } from './etapa_educativa.controller';
import { EtapaEducativaService } from './etapa_educativa.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([EtapaEducativa])],
  controllers: [EtapaEducativaController],
  providers: [EtapaEducativaService]
})
export class EtapaEducativaModule {}
