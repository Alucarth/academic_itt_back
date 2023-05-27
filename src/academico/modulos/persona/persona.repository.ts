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
    const result0 = await this.dataSource.getRepository(Persona).findOneBy({
      carnetIdentidad: dto.carnetIdentidad,
      complemento: dto.complemento,
    });

    console.log("result0: ", result0);

    if (!result0) {
      return false;
    }

    console.log("result0.id", result0.id);

    const result = await this.dataSource.query(`

    SELECT
    data2.*,
    ut.lugar AS comunidad,
    muni.lugar AS municipio,
    prov.lugar AS provincia,
    dep.lugar AS departamento,
    pais.lugar AS pais 
  FROM
    (
    SELECT DATA
      .*,
      ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = DATA.provincia_id ) AS depto_id,
      ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID IN ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = DATA.provincia_id ) ) AS pais_id 
    FROM
      (
      SELECT		
        persona.*,
        ( SELECT genero FROM genero_tipo WHERE ID = persona.genero_tipo_id ) AS genero,			
        ( SELECT idioma FROM idioma_tipo WHERE ID = persona.materno_idioma_tipo_id ) AS materno_idioma_tipo,	
        nacimiento_unidad_territorial_id AS comunidad_id,
        ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = nacimiento_unidad_territorial_id ) AS municipio_id,
        ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID IN ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = nacimiento_unidad_territorial_id ) ) AS provincia_id
        
      FROM
        persona
      WHERE
        persona.ID = ${result0.id}
      ) AS DATA 
    ) AS data2
    INNER JOIN unidad_territorial ut ON ut.ID = data2.comunidad_id
    INNER JOIN unidad_territorial muni ON muni.ID = data2.municipio_id
    INNER JOIN unidad_territorial prov ON prov.ID = data2.provincia_id
    INNER JOIN unidad_territorial dep ON dep.ID = data2.depto_id
    INNER JOIN unidad_territorial pais ON pais.ID = data2.pais_id

    `);

    console.log("result: ", result);

    return result;
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
