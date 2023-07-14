import { Injectable } from '@nestjs/common'
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateCarreraAutorizadaResolucionDto } from '../carrera_autorizada_resolucion/dto/createCarreraAutorizadaResolucion.dto';

@Injectable()
export class InstitutoEstudianteInscripcionDocenteCalificacionRepository {
   
   
    
    constructor(private dataSource: DataSource) {}

    async getOneBy(id){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).findBy({ id: id });
        
    }
    
    async findAll(){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).find();
        
    }
    async findCalificacionesByModalidadAula(modalidad_id, docente_id){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).findBy(
            {'modalidadEvaluacionTipoId':modalidad_id,
             'aulaDocenteId':docente_id,
        });
        
    }
    async findCalificacionesByDato(item){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).findOneBy(
            {'modalidadEvaluacionTipoId':item.modalidad_evaluacion_tipo_id,
             'aulaDocenteId':item.aula_docente_id,
             'notaTipoId':item.nota_tipo_id,
             'periodoTipoId':item.periodo_tipo_id,
             'institutoEstudianteInscripcionId':item.instituto_estudiante_inscripcion_id,
        });
        
    }
    async findPromedioByDato(nota_tipo,periodo,id, modalidad){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).findOneBy(
            {'modalidadEvaluacionTipoId':modalidad,
             'notaTipoId':nota_tipo,
             'periodoTipoId':periodo,
             'institutoEstudianteInscripcionId':id,
        });
        
    }

    async findAllCarrerasByDocenteId(id){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
        .createQueryBuilder("ad")
        .innerJoinAndSelect("ad.aula", "a")
        .innerJoinAndSelect("a.ofertaCurricular", "o")
        .innerJoinAndSelect("o.institutoPlanEstudioCarrera", "ip")
        .innerJoinAndSelect("ip.carreraAutorizada", "ca")
        .innerJoinAndSelect("ca.carreraTipo", "ct")
        //.groupBy("ct.id")
        .select([
            'ad.id',
            'a.id as aula_id',
            'o.id as oferta_curricular_id',
            'ip.id as instituto_plan_estudio_carrera_id',
            'ca.id as carrera_autorizada_id',
            'ct.id as carrera_tipo_id',
            'ct.carrera as carrera',
        ])
          .where("ad.maestroInscripcionId = :id ", { id })
          .getRawMany();
    }

    async findAllCalificacionesByAulaId(id){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
        .createQueryBuilder("ad")
        .innerJoinAndSelect("ad.institutoEstudianteInscripcion", "i")
        .innerJoinAndSelect("ad.notaTipo", "n")
        .innerJoinAndSelect("ad.modalidadEvaluacionTipo", "me")
        .innerJoinAndSelect("i.matriculaEstudiante", "m")
        .innerJoinAndSelect("m.institucion_educativa_estudiante", "ie")
        .innerJoinAndSelect("ie.persona", "p")
        .select([
            'ad.id',
            'ad.cuantitativa',
            'n.nota',
            'me.modalidadEvaluacion',
            'm.id as matricula_id',
            'ie.id as institucion_educativa_estudiante_id',
            'i.id as instituto_estudiante_inscripcion_id',
            'p.id as persona_id',
            'p.nombre as nombre',
            'p.paterno as paterno',
            'p.materno as materno',
        ])
          .where("ad.aulaId = :id ", { id })
          .getRawMany();
    }
    async findAllCalificacionesByInscripcionId(id){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
        .createQueryBuilder("ad")
        .innerJoinAndSelect("ad.notaTipo", "n")
        .innerJoinAndSelect("ad.modalidadEvaluacionTipo", "me")
        .select([
            'ad.id as id',
            'ad.cuantitativa as cuantitativa',
            'n.nota as nota_tipo',
            'me.modalidadEvaluacion as modalidad_evaluacion',
            'me.id as modalidad_id',
            'n.id as nota_tipo_id',
        ])
          .where("ad.institutoEstudianteInscripcionId = :id ", { id })
          .getRawMany();
    }
    async findAllCalificacionesByInscripcionModalidadId(id,modalidad){
        return  await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
        .createQueryBuilder("ad")
        .innerJoinAndSelect("ad.notaTipo", "n")
        .innerJoinAndSelect("ad.modalidadEvaluacionTipo", "me")
        .select([
            'ad.id as id',
            'ad.cuantitativa as cuantitativa',
            'n.nota as nota_tipo',
            'me.modalidadEvaluacion as modalidad_evaluacion',
            'me.id as modalidad_id',
            'n.id as nota_tipo_id',
        ])
          .where("ad.institutoEstudianteInscripcionId = :id ", { id })
          .andWhere("ad.modalidadEvaluacionTipoId = :modalidad ", { modalidad })
          .getRawMany();
    }

    async crearInscripcionDocenteCalificacion(idUsuario, notas, transaction) {

        const calificaciones: InstitutoEstudianteInscripcionDocenteCalificacion[] = notas.map((item) => {
          
            const calificacion  = new InstitutoEstudianteInscripcionDocenteCalificacion()
            calificacion.institutoEstudianteInscripcionId = item.instituto_estudiante_inscripcion_id;
            calificacion.aulaDocenteId = item.aula_docente_id;
            calificacion.periodoTipoId = item.periodo_tipo_id;
            calificacion.cuantitativa = item.cuantitativa;
            calificacion.cualitativa = item.cualitativa;
            calificacion.valoracionTipoId = 1; //nota normal
            calificacion.notaTipoId = item.nota_tipo_id;
            calificacion.modalidadEvaluacionTipoId = item.modalidad_evaluacion_tipo_id;
            calificacion.usuarioId = idUsuario;
            return calificacion;
          });
        return await transaction.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).save(calificaciones);
    }
    async crearPromedios(idUsuario, notas,docente_id, modalidad_id, transaction) {

      const calificaciones: InstitutoEstudianteInscripcionDocenteCalificacion[] = notas.map((item) => {
        
          const calificacion  = new InstitutoEstudianteInscripcionDocenteCalificacion()
          calificacion.institutoEstudianteInscripcionId = item.instituto_estudiante_inscripcion_id;
          calificacion.aulaDocenteId = docente_id;
          calificacion.periodoTipoId = item.periodo_tipo_id;
          calificacion.cuantitativa = item.total;
          calificacion.cualitativa = 'FINAL';
          calificacion.valoracionTipoId = 1; //nota normal
          calificacion.notaTipoId = item.nota_tipo_id;
          calificacion.modalidadEvaluacionTipoId = modalidad_id;
          calificacion.usuarioId = idUsuario;
          return calificacion;
        });
      return await transaction.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).save(calificaciones);
  }
    /*
    async crearOneInscripcionDocenteCalificacion(idUsuario, item, transaction) {

       // const calificaciones: InstitutoEstudianteInscripcionDocenteCalificacion[] = notas.map((item) => {
          
            const calificacion  = new InstitutoEstudianteInscripcionDocenteCalificacion()
            calificacion.institutoEstudianteInscripcionId = item.instituto_estudiante_inscripcion_id;
            calificacion.aulaDocenteId = item.aula_docente_id;
            calificacion.periodoTipoId = item.periodo_tipo_id;
            calificacion.cuantitativa = item.cuantitativa;
            calificacion.cualitativa = item.cualitativa;
            calificacion.valoracionTipoId = 1; //nota normal
            calificacion.notaTipoId = item.nota_tipo_id;
            calificacion.modalidadEvaluacionTipoId = item.modalidad_evaluacion_tipo_id;
            calificacion.usuarioId = idUsuario;
          //  return calificacion;
          //});
        return await transaction.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion).save(calificacion);
    }*/
    async crearOneInscripcionDocenteCalificacion(
      idUsuario, 
      item, 
      modalidad, 
      docente, 
      nota_tipo,
      transaction) {

      return   await transaction
      .createQueryBuilder()
      .insert()
      .into(InstitutoEstudianteInscripcionDocenteCalificacion)
      .values({
        institutoEstudianteInscripcionId : item.instituto_estudiante_inscripcion_id,
        aulaDocenteId : docente,
        periodoTipoId : item.periodo_tipo_id,
        cuantitativa : item.cuantitativa,
        cualitativa : '',
        valoracionTipoId : 1, //nota normal
        notaTipoId : nota_tipo,
        modalidadEvaluacionTipoId :modalidad,
        usuarioId : idUsuario,
      })
      .execute();
    }

    async actualizarDatosCalificaciones(
        id: number,
        item:any,
        transaction: EntityManager
      ) {
        
        return await transaction
          .createQueryBuilder()
          .update(InstitutoEstudianteInscripcionDocenteCalificacion)
          .set({
            cuantitativa:item.cuantitativa
          })
          .where({ id: id })
          .execute();
      }

      async actualizaPromedio(
        idUsuario: number,
        id: number,
        item:any,
 
      ) {
        
        return await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
          .createQueryBuilder()
          .update(InstitutoEstudianteInscripcionDocenteCalificacion)
          .set({
            cuantitativa:item.total
          })
          .where({ id: id })
          .execute();
      }
      
      async actualizaEstadoMatricula(
        id: number,
        estado:number,
 
      ) {
        console.log("actualiza_estado")
        console.log(id)
        console.log(estado)
        return await this.dataSource.getRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
          .createQueryBuilder()
          .update(InstitutoEstudianteInscripcion)
          .set({
            estadoMatriculaTipoId: estado,
          })
          .where({ id: id })
          .execute();
      }
  

      async findAllPromedioSemestralByAulaId(id: number) {
        
        const result = await this.dataSource.query(`
    
        SELECT 
        c.instituto_estudiante_inscripcion_id, 
        c.nota_tipo_id , 
        SUM(c.cuantitativa)/2 as cuantitativa,
        COUNT(c.modalidad_evaluacion_tipo_id) as cantidad,
        c.periodo_tipo_id
        FROM 
        instituto_estudiante_inscripcion_docente_calificacion c, 
        instituto_estudiante_inscripcion i 
        WHERE 
        i.aula_id = ${id}  
        AND i.id = c.instituto_estudiante_inscripcion_id 
        AND c.modalidad_evaluacion_tipo_id in (1,2) 
        GROUP BY 
        c.instituto_estudiante_inscripcion_id, c.nota_tipo_id, c.periodo_tipo_id
        HAVING
        COUNT(c.modalidad_evaluacion_tipo_id)=2
        ORDER BY 
        c.instituto_estudiante_inscripcion_id , c.nota_tipo_id 
        `);
        console.log("resultSemestral== ", result);
        return result;
      }
      async findAllPromedioAnualByAulaId(id: number) {
        
        const result = await this.dataSource.query(`
    
        SELECT 
        c.instituto_estudiante_inscripcion_id, 
        c.nota_tipo_id , 
        SUM(c.cuantitativa)/4 as cuantitativa,
        COUNT(c.modalidad_evaluacion_tipo_id) as cantidad,
        c.periodo_tipo_id
        FROM 
        instituto_estudiante_inscripcion_docente_calificacion c, 
        instituto_estudiante_inscripcion i 
        WHERE 
        i.aula_id = ${id}  
        AND i.id = c.instituto_estudiante_inscripcion_id 
        AND c.modalidad_evaluacion_tipo_id in (3,4,5,6) 
        GROUP BY 
        c.instituto_estudiante_inscripcion_id, c.nota_tipo_id, c.periodo_tipo_id
        HAVING
        COUNT(c.modalidad_evaluacion_tipo_id)=4
        ORDER BY 
        c.instituto_estudiante_inscripcion_id , c.nota_tipo_id 
    
        `);
    
        console.log("resultAnual: ", result);
    
        return result;
      }

      async findAllPromedioAnualByEstudianteId(id: number) {
        
        const result = await this.dataSource.query(`
        SELECT 
        c.instituto_estudiante_inscripcion_id, 
        c.nota_tipo_id , 
        sum(c.cuantitativa)/4 as total,
        count(c.modalidad_evaluacion_tipo_id ) as cantidad
        FROM 
        instituto_estudiante_inscripcion_docente_calificacion c
        WHERE 
        c.instituto_estudiante_inscripcion_id = ${id}  
        AND c.modalidad_evaluacion_tipo_id in (3,4,5,6)
        GROUP BY 
        c.instituto_estudiante_inscripcion_id, c.nota_tipo_id , c.periodo_tipo_id
        ORDER BY 
        c.instituto_estudiante_inscripcion_id , c.nota_tipo_id 
        `);
    
        console.log("result= ", result);
    
        return result;
      }

      async findAllSubtotalByAulaId(id: number, modalidad: number ) {
        
        const result = await this.dataSource.query(`
        SELECT 
        c.instituto_estudiante_inscripcion_id, 
        SUM(c.cuantitativa) as cuantitativa,
        c.periodo_tipo_id 
        FROM 
        instituto_estudiante_inscripcion_docente_calificacion c, 
        instituto_estudiante_inscripcion i 
        WHERE 
        i.aula_id = ${id}  
        AND i.id = c.instituto_estudiante_inscripcion_id 
        AND c.modalidad_evaluacion_tipo_id = ${modalidad}
        AND nota_tipo_id <>7
        GROUP BY 
        c.instituto_estudiante_inscripcion_id,
        c.periodo_tipo_id
        ORDER BY 
        c.instituto_estudiante_inscripcion_id
        `);
        console.log("resultSuma: ", result);
        return result;
      }

      async findAllEstadosFinalesByAulaId(id: number) {
        
        const result = await this.dataSource.query(`
        SELECT 
        c.instituto_estudiante_inscripcion_id, 
        c.cuantitativa as total ,
       case
       	when c.cuantitativa >60 then 30
       	else 43
       end as estado
         FROM 
        instituto_estudiante_inscripcion_docente_calificacion c, 
        instituto_estudiante_inscripcion i 
        WHERE 
        i.aula_id = ${id} 
        AND i.id = c.instituto_estudiante_inscripcion_id 
        AND c.modalidad_evaluacion_tipo_id in (7,8) 
        AND c.nota_tipo_id=7
        ORDER BY 
        c.instituto_estudiante_inscripcion_id
        `);
        console.log("resultEstados= ", result);
        return result;
      }

      async findAllPromedioSemestralByEstudianteId(id: number) {
       
        
        const result = await this.dataSource.query(`
        SELECT 
        c.instituto_estudiante_inscripcion_id, 
        c.nota_tipo_id , 
        sum(c.cuantitativa)/2 as total,
        count(c.modalidad_evaluacion_tipo_id ) as cantidad
        FROM 
        instituto_estudiante_inscripcion_docente_calificacion c
        WHERE 
        c.instituto_estudiante_inscripcion_id = ${id}  
        AND c.modalidad_evaluacion_tipo_id in (1,2)
        GROUP BY 
        c.instituto_estudiante_inscripcion_id, c.nota_tipo_id , c.periodo_tipo_id
        ORDER BY 
        c.instituto_estudiante_inscripcion_id , c.nota_tipo_id 
        `);
    
        console.log("result= ", result);
    
        return result;
      }
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
