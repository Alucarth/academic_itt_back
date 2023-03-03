import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneroTipo } from 'src/academico/entidades/generoTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { GeneroTipoController } from './genero_tipo.controller';
import { GeneroTipoService } from './genero_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([GeneroTipo])],
  controllers: [GeneroTipoController],
  providers: [GeneroTipoService]
})
export class GeneroTipoModule {}
