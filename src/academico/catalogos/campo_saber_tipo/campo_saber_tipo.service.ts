import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampoSaberTipo } from 'src/academico/entidades/campoSaberTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class CampoSaberTipoService {
    constructor(
        @InjectRepository(CampoSaberTipo)
        private campoSaberTipoRepository: Repository<CampoSaberTipo>,
    ){}
        async getAllItt(){            
            return  await this.campoSaberTipoRepository.findBy({'comentario':'ITT'});
        }
}
