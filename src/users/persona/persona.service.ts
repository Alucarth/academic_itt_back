import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RespuestaM } from '../../shared/respuesta.model'
import { Persona } from '../entity/persona.entity'
import { PersonaBusquedaCiFechaNacDTO} from '../dto/persona.dto'
import { PersonaMReadDto, PersonaMSearchDto } from '../dto/persona.dto'

@Injectable()
export class PersonaService {

    constructor(@InjectRepository(Persona) private _personaRepo: Repository<Persona>,){}


    async findAllByCiFechaNac(dto: PersonaBusquedaCiFechaNacDTO): Promise<RespuestaM> {
        return null;
    }

}
