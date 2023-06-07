import { Injectable } from '@nestjs/common'
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
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
            'n.notaTipo',
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

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
