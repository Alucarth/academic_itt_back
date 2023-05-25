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
