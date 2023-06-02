import { Injectable } from '@nestjs/common'
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateCarreraAutorizadaResolucionDto } from '../carrera_autorizada_resolucion/dto/createCarreraAutorizadaResolucion.dto';

@Injectable()
export class AulaDocenteRepository {
   
    
    constructor(private dataSource: DataSource) {}

    async getOneBy(id){
        return  await this.dataSource.getRepository(AulaDocente).findBy({ id: id });
        
    }
    
    async findAll(){
        return  await this.dataSource.getRepository(AulaDocente).find();
        
    }

    async findAllCarrerasByDocenteId(id){
        return  await this.dataSource.getRepository(AulaDocente)
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
    async findAllCarrerasByPersonaId(id){
        return  await this.dataSource.getRepository(AulaDocente)
        .createQueryBuilder("ad")
        .innerJoinAndSelect("ad.aula", "a")
        .innerJoinAndSelect("ad.maestroInscripcion", "m")
        .innerJoinAndSelect("a.ofertaCurricular", "o")
        .innerJoinAndSelect("o.institutoPlanEstudioCarrera", "ip")
        .innerJoinAndSelect("ip.carreraAutorizada", "ca")
        .innerJoinAndSelect("ca.carreraTipo", "ct")
        //.groupBy("ct.id")
        .select([
            'ad.id as id',
            'a.id as aula_id',
            'o.id as oferta_curricular_id',
            'ip.id as instituto_plan_estudio_carrera_id',
            'ca.id as carrera_autorizada_id',
            'ct.id as carrera_tipo_id',
            'ct.carrera as carrera',
            'm.id as maestro_inscripcion_id',
        ])
          .where("m.personaId = :id ", { id })
          .getRawMany();
    }
    async findAllCarrerasDocentesAulasByPersonaId(id){
        return  await this.dataSource.getRepository(AulaDocente)
        .createQueryBuilder("ad")
        .innerJoinAndSelect("ad.aula", "a")
        .innerJoinAndSelect("a.paraleloTipo", "p")
        .innerJoinAndSelect("ad.maestroInscripcion", "m")
        .innerJoinAndSelect("a.ofertaCurricular", "o")
        .innerJoinAndSelect("o.institutoPlanEstudioCarrera", "ip")
        .innerJoinAndSelect("ip.carreraAutorizada", "ca")
        .innerJoinAndSelect("ca.carreraTipo", "ct")
        .innerJoinAndSelect("o.planEstudioAsignatura", "pea")
        .innerJoinAndSelect("pea.asignaturaTipo", "as")
        .innerJoinAndSelect("pea.regimenGradoTipo", "rg")
        //.groupBy("ct.id")
        .select([
            'ad.id as id',
            'a.id as aula_id',
           
            'o.id as oferta_curricular_id',
            'ip.id as instituto_plan_estudio_carrera_id',
            'ca.id as carrera_autorizada_id',
            'ct.id as carrera_tipo_id',
            'ct.carrera as carrera',
            'm.id as maestro_inscripcion_id',
            'pea.id as plan_estudio_asignatura_id',
            'as.asignatura as asignatura',
            'as.abreviacion as abreviacion',
            'a.cupo as cupo',
            'p.paralelo as paralelo',
            'rg.regimenGrado as regimenGrado',
        ])
          .where("m.personaId = :id ", { id })
          .getRawMany();
    }

    async crearDocentesAulas(idUsuario, aulasDocentes, transaction) {

        const planesAsignaturas: AulaDocente[] = aulasDocentes.map((item) => {
          
            const aulaDocente  = new AulaDocente()
            aulaDocente.aulaId = item.aula_id;
            aulaDocente.maestroInscripcionId = item.maestro_inscripcion_id;
            aulaDocente.asignacionFechaInicio = item.fecha_inicio;
            aulaDocente.asignacionFechaFin = item.fecha_fin;
            aulaDocente.bajaTipoId = 0;
            aulaDocente.usuarioId = idUsuario;
            aulaDocente.observacion = "ASIGNACION";
            return aulaDocente;
          });
        return await transaction.getRepository(AulaDocente).save(planesAsignaturas);
    }

    async crearDocenteAula(idUsuario, dto, transaction) {

          const aulaDocente  = new AulaDocente()
          aulaDocente.aulaId = dto.aula_id;
          aulaDocente.maestroInscripcionId = dto.maestro_inscripcion_id;
          aulaDocente.asignacionFechaInicio = dto.fecha_inicio;
          aulaDocente.asignacionFechaFin = dto.fecha_fin;
          aulaDocente.bajaTipoId = 0;
          aulaDocente.usuarioId = idUsuario;
          aulaDocente.observacion = "ASIGNACION";
        return await transaction.getRepository(AulaDocente).save(aulaDocente);
    }
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
