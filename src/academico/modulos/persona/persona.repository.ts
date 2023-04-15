import { Injectable } from '@nestjs/common'
import { Persona } from 'src/academico/entidades/persona.entity';
import { DataSource } from 'typeorm'
import { CreatePersonaoDto } from './dto/createPersona.dto';
import { SearchDatoDto } from './dto/searchDato.dto';

@Injectable()
export class PersonaRepository {
    
    constructor(
        private dataSource: DataSource
    ) {}

    async getById(id:number){
        return  await this.dataSource.getRepository(Persona).findBy({id : id});
    }
    async getPersonaByDato(dto:SearchDatoDto){
        return  await this.dataSource.getRepository(Persona).findOneBy({
            carnetIdentidad : dto.carnetIdentidad,
            complemento:dto?.complemento
            });
    }

    async crearPersona(dto: CreatePersonaoDto) {

        
        const persona = new Persona();
        persona.carnetIdentidad = dto.carnetIdentidad;
        persona.complemento = dto.complemento;
        persona.paterno = dto.paterno;
        persona.materno = dto.materno;
        persona.nombre = dto.nombre;
        persona.fechaNacimiento = dto.fechaNacimiento;
        persona.generoTipoId = dto.generoTipoId;
        persona.estadoCivilTipoId = dto.estadoCivilTipoId;
        persona.sangreTipoId = dto.sangreTipoId;
        persona.maternoIdiomaTipoId = dto.maternoIdiomaTipoId;
        persona.segipTipoId = dto.segipTipoId;
        persona.expedidoUnidadTerritorialId = dto.expedidoUnidadTerritorialId;
        persona.nacimientoUnidadTerritorialId = dto.nacimientoUnidadTerritorialId;
        persona.nacimientoOficialia = dto.nacimientoOficialia;
        persona.nacimientoLibro = dto.nacimientoLibro;
        persona.nacimientoPartida = dto.nacimientoPartida;
        persona.nacimientoFolio = dto.nacimientoFolio;
        persona.carnetIbc = dto.carnetIbc;
        persona.pasaporte = dto.pasaporte;
        persona.libretaMilitar = dto.libretaMilitar;
        persona.dobleNacionalidad = dto.dobleNacionalidad;
        persona.codigoRda = dto.codigoRda;
        persona.nacimientoLocalidad = dto.nacimientoLocalidad;
        persona.tieneDiscapacidad = dto.tieneDiscapacidad;
        persona.telefono = dto.telefono;
        persona.email = dto.email;
        
        return await this.dataSource.getRepository(Persona).save(persona);
        
    }

}
