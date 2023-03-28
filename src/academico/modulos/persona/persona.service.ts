import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CustomRepositoryDoesNotHaveEntityError } from 'typeorm';
import { CreatePersonaoDto } from './dto/createPersona.dto';
import { SearchDatoDto } from './dto/searchDato.dto';
import { PersonaRepository } from './persona.repository';

@Injectable()
export class PersonaService {
    constructor(
        @Inject(PersonaRepository)
        private personaRepositorio: PersonaRepository,
        private _serviceResp: RespuestaSigedService, 
    ){}
    async findPersona( id:number ){
        return await this.personaRepositorio.getById(id);
      
    }
    async findPersonaByDato( dto:SearchDatoDto ){
        return await this.personaRepositorio.getPersonaByDato(dto);
      
    }
    async createPersona (dto: CreatePersonaoDto) {

        const datoBusqueda = {
            carnetIdentidad:dto.carnetIdentidad,
            complemento:dto.complemento,
        }
        const existePersona = await this.personaRepositorio.getPersonaByDato(datoBusqueda);
        console.log(existePersona);
        if(existePersona.length == 0){
            const dato = await this.personaRepositorio.crearPersona(dto);
            return this._serviceResp.respuestaHttp201(
                dato.id,
                'Registro Creado !!',
                '',
              );

        }else{
            return this._serviceResp.respuestaHttp400(
                existePersona,
                'Persona ya existen !!',
                '');
        }
        
    }
}