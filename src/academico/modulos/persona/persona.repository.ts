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
    console.log('HERE---');
    console.log('dto:', dto);

    const result0 = await this.dataSource.getRepository(Persona).findOneBy({
      carnetIdentidad: dto.carnetIdentidad,
      complemento: dto.complemento,
    });

    console.log("result0: ", result0);

    if (!result0) {
      return false;
    }

    console.log("result0.id", result0.id);

    //VEMOS SI TIENE HASTA COMUNIDAD O SOLO PAIS
    const resultUt = await this.dataSource.query(`
    SELECT      
      persona.id as persona_id,  
      unidad_territorial.id as unidad_territorial_id, 
      unidad_territorial.lugar, 
      unidad_territorial.unidad_territorial_tipo_id, 
      unidad_territorial.unidad_territorial_id, 
      unidad_territorial_tipo.unidad_territorial, 
      unidad_territorial_tipo.comentario
    FROM      
      persona      
      INNER JOIN
      unidad_territorial
      ON 
        persona.nacimiento_unidad_territorial_id = unidad_territorial.id
      INNER JOIN
      unidad_territorial_tipo
      ON 
        unidad_territorial.unidad_territorial_tipo_id = unidad_territorial_tipo.id
      WHERE persona.id = ${result0.id}
    `);


    if(resultUt[0]['unidad_territorial_tipo_id'] == 0)
    {
      //es solo un pais
      const result = await this.dataSource.query(`
       
        SELECT		
          persona.*,
          ( SELECT genero FROM genero_tipo WHERE ID = persona.genero_tipo_id ) AS genero,			
          ( SELECT idioma FROM idioma_tipo WHERE ID = persona.materno_idioma_tipo_id ) AS materno_idioma_tipo,	          
          nacimiento_unidad_territorial_id AS pais_id,
          ( SELECT lugar FROM unidad_territorial WHERE ID = nacimiento_unidad_territorial_id ) AS pais,
          0 as depto_id,
          0 as provincia_id,
          0 as municipio_id,
          0 as comunidad_id,
          '' as departamento,
          '' as provincia,
          '' as municipio,
          '' as comunidad
        FROM
          persona
        WHERE
          persona.ID = ${result0.id}
         
  
      `);
  
      console.log("result: ", result);
  
      return result;
      

    }else{

      //llega a comunidad
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
        left JOIN unidad_territorial ut ON ut.ID = data2.comunidad_id
        left JOIN unidad_territorial muni ON muni.ID = data2.municipio_id
        left JOIN unidad_territorial prov ON prov.ID = data2.provincia_id
        left JOIN unidad_territorial dep ON dep.ID = data2.depto_id
        left JOIN unidad_territorial pais ON pais.ID = data2.pais_id
  
      `);
  
      console.log("result: ", result);
  
      return result;
    }
    
  }

  async crearPersona(dto: CreatePersonaoDto) {
 
    console.log(dto);
    const persona = new Persona();
    persona.carnetIdentidad               = dto.carnetIdentidad;
    persona.complemento                   = dto.complemento;
    persona.paterno                       = dto.paterno;
    persona.materno                       = dto.materno;
    persona.nombre                        = dto.nombre;
    persona.fechaNacimiento               = new Date(dto.fechaNacimiento);
    persona.generoTipoId                  = dto.generoTipoId;
    persona.estadoCivilTipoId             = dto.estadoCivilTipoId;
    persona.sangreTipoId                  = dto.sangreTipoId;
    persona.maternoIdiomaTipoId           = dto.maternoIdiomaTipoId;
    persona.segipTipoId                   = dto.segipTipoId;
    persona.expedidoUnidadTerritorialId   = dto.expedidoUnidadTerritorialId;
    persona.nacimientoUnidadTerritorialId = dto.nacimientoUnidadTerritorialId;
    persona.nacimientoOficialia           = dto.nacimientoOficialia;
    persona.nacimientoLibro               = dto.nacimientoLibro;
    persona.nacimientoPartida             = dto.nacimientoPartida;
    persona.nacimientoFolio               = dto.nacimientoFolio;
    persona.carnetIbc                     = dto.carnetIbc;
    persona.pasaporte                     = dto.pasaporte;
    persona.libretaMilitar                = dto.libretaMilitar;
    persona.dobleNacionalidad             = dto.dobleNacionalidad;
    persona.codigoRda                     = dto.codigoRda;
    persona.nacimientoLocalidad           = dto.nacimientoLocalidad;
    persona.tieneDiscapacidad             = dto.tieneDiscapacidad;
    persona.telefono                      = dto.telefono;
    persona.email                         = dto.email;
    persona.cedulaTipoId                  = dto.cedulaTipoId;

    return await this.dataSource.getRepository(Persona).save(persona);
  }

  async updatePersona(dto: UpdatePersonaoDto) {
    console.log('dto.id--> ', dto.id);
    try {

        const res = await this.dataSource.getRepository(Persona)
          .createQueryBuilder()
          .update(Persona)
          .set({

           generoTipoId                 : dto.generoTipoId,
           estadoCivilTipoId            : dto.estadoCivilTipoId,
           maternoIdiomaTipoId          : dto.maternoIdiomaTipoId,
           expedidoUnidadTerritorialId  : dto.expedidoUnidadTerritorialId,
           nacimientoUnidadTerritorialId: dto.nacimientoUnidadTerritorialId,
           nacimientoOficialia          : dto.nacimientoOficialia,
           nacimientoLibro              : dto.nacimientoLibro,
           nacimientoPartida            : dto.nacimientoPartida,
           nacimientoFolio              : dto.nacimientoFolio,
           carnetIbc                    : dto.carnetIbc,
           pasaporte                    : dto.pasaporte,
           libretaMilitar               : dto.libretaMilitar,
           dobleNacionalidad            : dto.dobleNacionalidad,
           codigoRda                    : dto.codigoRda,
           nacimientoLocalidad          : dto.nacimientoLocalidad,
           tieneDiscapacidad            : dto.tieneDiscapacidad,
           telefono                     : dto.telefono,
           email                        : dto.email,
           cedulaTipoId                 : dto.cedulaTipoId
            
          })
          .where("id = :id", { id: dto.id })
          .execute();

        console.log("res:", res);
        console.log("perosna Inscripcion actualizado");
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

  async getHistorialById(personaId, sie) {
    
    console.log('here');

    const datosgrales = await this.dataSource.query(`
    SELECT
      persona.id, 
      persona.carnet_identidad, 
      persona.complemento, 
      persona.paterno, 
      persona.materno, 
      persona.nombre, 
      persona.fecha_nacimiento, 
      persona.codigo_rude, 
      persona.email, 
      institucion_educativa.id, 
      institucion_educativa.institucion_educativa, 
      institucion_educativa_sucursal.id, 
      institucion_educativa_sucursal.sucursal_codigo, 
      institucion_educativa_sucursal.sucursal_nombre
    FROM
      persona
      INNER JOIN
      institucion_educativa_estudiante
      ON 
        persona.id = institucion_educativa_estudiante.persona_id
      INNER JOIN
      institucion_educativa_sucursal
      ON 
        institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
      INNER JOIN
      institucion_educativa
      ON 
        institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id        
      where persona.id = ${personaId} and institucion_educativa.id = ${sie}
    `);

    if(datosgrales.length == 0){
      return false;
    }
   
    return {
      persona: personaId,
      nombre: datosgrales[0]['paterno'] + ' ' + datosgrales[0]['materno'] + ' ' + datosgrales[0]['nombre'] ,
      ci: datosgrales[0]['carnet_identidad'],
      sie: sie,
      ue: datosgrales[0]['institucion_educativa'],
      carrera: 'BELLEZA INTEGRAL',
      gestiones: [
       
        {
          gestion: 2023,
          periodoId:54,
          periodo: 'Semestre I/2023',
          materias: [
            {
              asignatura: 'asignatura 1',
              paralelo: 'A',
              nota_final:75,
              estado_matricula: 'APROBADO'
            },
            {
              asignatura: 'asignatura 2',
              paralelo: 'A',
              nota_final:50,
              estado_matricula: 'REPROBADO'
            }
          ]
        },
        
        {
          gestion: 2023,
          periodoId:55,
          periodo: 'Semestre II/2023',
          materias: [
            {
              asignatura: 'asignatura AA',
              paralelo: 'B',
              nota_final:75,
              estado_matricula: 'APROBADO'
            },
            {
              asignatura: 'asignatura BB',
              paralelo: 'C',
              nota_final:50,
              estado_matricula: 'REPROBADO'
            }
          ]
        }

      ]
    };



  }


  async getBuscadorGestionPeriodo(sie) {
    
    console.log('here');

    const result = await this.dataSource.query(`

    select distinct gestion_tipo_id, periodo_tipo_id, periodo, institucion_educativa as nombre 
    from 
    (
    SELECT
	operativo_carrera_autorizada.gestion_tipo_id, 
	operativo_carrera_autorizada.periodo_tipo_id, 
	operativo_carrera_autorizada.carrera_autorizada_id, 
	institucion_educativa_sucursal.institucion_educativa_id,
	carrera_tipo."id", 
	carrera_tipo.carrera, 
	carrera_autorizada."id", 
	periodo_tipo.periodo, 
	periodo_tipo.abreviacion, 
	institucion_educativa.institucion_educativa, 
	institucion_educativa."id"
FROM
	carrera_autorizada
	INNER JOIN
	operativo_carrera_autorizada
	ON 
		carrera_autorizada."id" = operativo_carrera_autorizada.carrera_autorizada_id
	INNER JOIN
	institucion_educativa_sucursal
	ON 
		carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal."id"
	INNER JOIN
	carrera_tipo
	ON 
		carrera_autorizada.carrera_tipo_id = carrera_tipo."id"
	INNER JOIN
	periodo_tipo
	ON 
		operativo_carrera_autorizada.periodo_tipo_id = periodo_tipo."id"
	INNER JOIN
	institucion_educativa
	ON 
		institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa."id"
WHERE
	institucion_educativa_sucursal.institucion_educativa_id = ${sie}
    
		) as data
      

    `);

    return result;


  }
}
