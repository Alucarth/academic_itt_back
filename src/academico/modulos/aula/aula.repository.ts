import { Injectable } from '@nestjs/common'
import { Aula } from 'src/academico/entidades/aula.entity';
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class AulaRepository {
constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(Aula).find();
    }
    async getDatoAula(id, paralelo){

        return  await this.dataSource.getRepository(Aula).findOne({where:{
            ofertaCurricularId:id,
            paraleloTipoId:paralelo,
            },
        });
    }
    async getDatoAulaById(id:number){

        return  await this.dataSource.getRepository(Aula).findOne({where:{
            id:id,
            },
        });
    }
    async getDatoAulaPeriodo(id){

        return  await this.dataSource.getRepository(Aula)
        .createQueryBuilder('a')
        .innerJoin('a.ofertaCurricular', 'o')
        .where('a.id = :id', {id})
        .select([
            'a.id as aula_id',
            'a.cupo as cupo',
            'o.id as oferta_id',
            'o.periodo_tipo_id as periodo_tipo_id',
        ])
        .getRawOne();
    }
    async getDatoAulaDocente(id){

        return  await this.dataSource.getRepository(Aula)
        .createQueryBuilder('a')
        .innerJoin('a.aulasDocentes', 'd')
        .where('a.id = :id', {id})
        .andWhere('d.bajaTipoId = 0')
        .select([
            'a.id as aula_id',
            'd.id as aula_docente_id',
            
        ])
        .getRawOne();
    }
    async getInscritosByAulaId(id){

        return  await this.dataSource.getRepository(Aula)
        .createQueryBuilder('a')
        .innerJoin('a.institutoEstudianteInscripcions', 'iei')
        .where('a.id = :id', {id})
        .select([
            'a.id as aula_id',
            'iei.id as instituto_estudiante_inscripcion_id',
        ])
        .getRawMany();
    }
    async getByAulaId(id:number){

        return  await this.dataSource.getRepository(Aula)
        .createQueryBuilder('a')
        .innerJoin('a.aulasDocentes', 'do')
        .innerJoin('a.ofertaCurricular', 'o')
        .innerJoin('o.institutoPlanEstudioCarrera', 'ip')
        .innerJoin('ip.carreraAutorizada', 'ca')
        .innerJoin('ca.carreraTipo', 'ct')
        .innerJoin('ca.resoluciones', 'r')
        .innerJoin('do.maestroInscripcion', 'ma')
        .innerJoin('ma.persona', 'p')
        .innerJoin('a.aulasDetalles', 'd')
        .innerJoin('a.paraleloTipo', 'pt')
        .innerJoin('d.diaTipo', 'dt')
        .where('a.id = :id', {id})
        .select([
            'a.id as aula_id',
            'a.cupo as cupo',
            'pt.paralelo as paralelo',
            'dt.dia as dia',
            'd.hora_inicio as hora_inicio',
            'd.hora_fin as hora_fin',
            'd.numero_aula as numero_aula',
            'do.id as aula_docente_id',
            'p.paterno as paterno',
            'p.materno as materno',
            'p.nombre as nombre',
            'o.id as oferta_id',
            'ip.id as instituto_plan_estudio_carrera_id',
            'ca.id as carrera_autorizada_id',
            'ct.carrera as carrera',
            'r.numero_resolucion as numero_resolucion',
        ])
        .getRawOne();
        
    }
    async getCalificacionesByAulaId(id:number){
        
        return  await this.dataSource.getRepository(Aula)
        .createQueryBuilder('a')
        .innerJoinAndSelect('a.institutoEstudianteInscripcions', 'i')
        .leftJoinAndSelect('i.inscripcionesDocentesCalificaciones', 'c')
        .leftJoinAndSelect('c.notaTipo', 'n')
        .leftJoinAndSelect('c.modalidadEvaluacionTipo', 'm')
        .innerJoinAndSelect('i.matriculaEstudiante', 'me')
        .innerJoinAndSelect('me.institucionEducativaEstudiante', 'ie')
        .innerJoinAndSelect('ie.persona', 'p')
        .where('a.id = :id', {id})
        .select([
            'a.id',
            'i.id',
            'me.id',
            'ie.id',
            'p.id',
            'c.id',
            'c.cuantitativa',
            'n.nota',
            'm.modalidadEvaluacion',
            'p.carnetIdentidad',
            'p.nombre',
            'p.paterno',
            'p.materno',
        ])
        .getMany();
        
    }
   
    async createAula(aula, transaction) {
        const au  = new Aula();
        au.ofertaCurricularId = aula.oferta_curricular_id;
        au.activo = true;
        au.cupo = aula.cupo;
        au.paraleloTipoId = aula.paralelo_tipo_id;
        au.usuarioId = aula.usuario_id;
      return await transaction.getRepository(Aula).save(au);
    }
    async updateAula(aula, transaction) {
        const dAula = await this.getDatoAulaById(aula.id);
        dAula.cupo = aula.cupo;
        dAula.paraleloTipoId = aula.paralelo_tipo_id;
      return await transaction.getRepository(Aula).save(dAula);
    }
    async crearAulaArray(idUsuario, id, aulas, transaction) {

        const det: Aula[] = aulas.map((item) => {
          const det  = new Aula()
          det.ofertaCurricularId =id;
          return det;
        });
    
        return await transaction.getRepository(Aula).save(det);
    }

    async deleteAula(id: number) {
        return await this.dataSource.getRepository(Aula).delete(id);
    }
    async deleteAulaDetalle(id: number) {

        const result = await this.dataSource.getRepository(Aula)
        .createQueryBuilder()
        .delete()
        .from(AulaDetalle)
        .where("aulaId = :id", { id })
        .execute();
        return result;   
    }
    async deleteAulaDocente(id: number) {

        const result = await this.dataSource.getRepository(Aula)
        .createQueryBuilder()
        .delete()
        .from(AulaDocente)
        .where("aulaId = :id", { id })
        .execute();
        return result;
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}