import { Injectable } from '@nestjs/common'
import { AsignaturaTipo } from 'src/academico/entidades/asignaturaTipo.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';

@Injectable()
export class OperativoCarreraAutorizadaRepository {
   
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(OperativoCarreraAutorizada).find();
    }
    async getOneById(id:number){
        return  await this.dataSource.getRepository(OperativoCarreraAutorizada).findOneBy({
            'id':id
        });
    }
    async getAllOperativosCarrera(id:number ){
        
        const operativos = await this.dataSource.getRepository(OperativoCarreraAutorizada)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.gestionTipo", "g")
        .innerJoinAndSelect("a.periodoTipo", "p")
        .innerJoinAndSelect("a.eventoTipo", "e")
        .select([
            'g.gestion as gestion',
            'g.id as gestion_tipo_id',
            'p.periodo as periodo',
            'p.id as periodo_tipo_id',
            'a.fechaInicio as fecha_inicio',
            'a.fechaFin as fecha_fin',
            'a.observacion as observacion',
            'a.activo as activo',
            'a.id as id',
        ])
        .where('a.carreraAutorizadaId = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getRawMany();
        console.log("ofertas desde backen");
        console.log(operativos);
        return operativos;
        
    }
    async getOperativoVigenteCarrera(id:number ){
        console.log(id);
        const operativos = await this.dataSource.getRepository(OperativoCarreraAutorizada)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.gestionTipo", "g")
        .innerJoinAndSelect("a.periodoTipo", "p")
        .innerJoinAndSelect("a.eventoTipo", "e")
        .leftJoinAndSelect("a.modalidadEvaluacionTipo", "m")
        .select([
            'g.gestion as gestion',
            'g.id as gestion_tipo_id',
            'p.periodo as periodo',
            'p.id as periodo_tipo_id',
            'a.fechaInicio as fecha_inicio',
            'a.fechaFin as fecha_fin',
            'a.observacion as observacion',
            'a.activo as activo',
            'a.id as id',
            'e.evento as evento',
            'm.modalidadEvaluacion as modalidad',
            'm.abreviacion as abreviacion',
            
        ])
        .where('a.carreraAutorizadaId = :id ', { id })
        .andWhere('a.activo = true')
        .orderBy('a.id', 'ASC')
        .getRawOne();
        console.log("operativo desde backen");
        console.log(operativos);
        return operativos;
        
    }

    async createOperativoCarrera(dto: CreateOperativoCarreraAutorizadaDto, transaction) {
       
        const operativo  = new OperativoCarreraAutorizada();
        operativo.gestionTipoId = dto.gestion_tipo_id;
        operativo.periodoTipoId = dto.periodo_tipo_id;
        operativo.carreraAutorizadaId = dto.carrera_autorizada_id;
        operativo.eventoTipoId = dto.evento_tipo_id;
        operativo.modalidadEvaluacionTipoId = dto.modalidad_evaluacion_tipo_id;
        operativo.fechaInicio = dto.fecha_inicio;
        operativo.fechaFin = dto.fecha_fin;
        operativo.activo = true;
        operativo.usuarioId = 1;
        operativo.observacion = dto.observacion;
       
        return await transaction.getRepository(OperativoCarreraAutorizada).save(operativo);
    
      }
      async actualizarEstado(carrera,gestion) {

        await this.dataSource
        .createQueryBuilder()
        .update(OperativoCarreraAutorizada)
        .set({
          activo:false
        })
        .where({ 
            carreraAutorizadaId: carrera,
            gestionTipoId:gestion
         })
        .execute();

      }

      async actualizarEstadoById(id: number) {
       
        return await this.dataSource
          .createQueryBuilder()
          .update(OperativoCarreraAutorizada)
          .set({
            activo:true
          })
          .where({ id: id })
          .execute();

      }
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
