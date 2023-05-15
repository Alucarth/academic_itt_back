import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Persona } from "src/academico/entidades/persona.entity";
import { DataSource } from "typeorm";
import { CreatePersonaoDto } from "./dto/createPersona.dto";
import { SearchDatoDto } from "./dto/searchDato.dto";
import { UpdatePersonaoDto } from "./dto/updatePersona.dto";

@Injectable()
export class PersonaRepository {
  constructor(private dataSource: DataSource) {}

  async getById(id: number) {
    return await this.dataSource.getRepository(Persona).findBy({ id: id });
  }
  async getPersonaByDato(dto: SearchDatoDto) {
    return await this.dataSource.getRepository(Persona).findOneBy({
      carnetIdentidad: dto.carnetIdentidad,
      complemento: dto?.complemento,
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

  async updatePersona(dto: UpdatePersonaoDto) {

    try {

        const res = await this.dataSource.getRepository(Persona)
          .createQueryBuilder()
          .update(Persona)
          .set({

           generoTipoId : dto.generoTipoId,
           estadoCivilTipoId : dto.estadoCivilTipoId,           
           maternoIdiomaTipoId : dto.maternoIdiomaTipoId,           
           expedidoUnidadTerritorialId : dto.expedidoUnidadTerritorialId,
           nacimientoUnidadTerritorialId : dto.nacimientoUnidadTerritorialId,
           nacimientoOficialia : dto.nacimientoOficialia,
           nacimientoLibro : dto.nacimientoLibro,
           nacimientoPartida : dto.nacimientoPartida,
           nacimientoFolio : dto.nacimientoFolio,
           carnetIbc : dto.carnetIbc,
           pasaporte : dto.pasaporte,
           libretaMilitar : dto.libretaMilitar,
           dobleNacionalidad : dto.dobleNacionalidad,
           codigoRda : dto.codigoRda,
           nacimientoLocalidad : dto.nacimientoLocalidad,
           tieneDiscapacidad : dto.tieneDiscapacidad,
           telefono : dto.telefono,
           email : dto.email,
            
          })
          .where("id = :id", { id: dto.id })
          .execute();

        console.log("res:", res);
        console.log("Maestro Inscripcion actualizado");
        return res;
    } catch (error) {

        console.log("Error update maestro inscripcion: ", error);
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `Error update maestro inscripcion: ${error.message}`,
          },
          HttpStatus.ACCEPTED,
          {
            cause: error,
          }
        );
        
    }

    
  }
}
