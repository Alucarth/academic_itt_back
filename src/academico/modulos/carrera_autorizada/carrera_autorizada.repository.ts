import { Injectable } from '@nestjs/common'
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateCarreraAutorizadaResolucionDto } from '../carrera_autorizada_resolucion/dto/createCarreraAutorizadaResolucion.dto';

@Injectable()
export class CarreraAutorizadaRepository {
   
    
    constructor(private dataSource: DataSource) {}

    async getOneBy(id){
        return  await this.dataSource.getRepository(CarreraAutorizada).findBy({ id: id });
        
    }
    
    async getAll(){
        return  await this.dataSource.getRepository(CarreraAutorizada).find();
        
    }

    async geAllCarrerasBySucursalId(id){
        return  await this.dataSource.getRepository(CarreraAutorizada)
        .createQueryBuilder("ca")
        .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
        .innerJoinAndSelect("ca.carreraTipo", "ct")
        .innerJoinAndSelect("ca.areaTipo", "at")
        .innerJoinAndSelect("ca.resoluciones", "r")
        .innerJoinAndSelect("r.resolucionTipo", "rt")
        .innerJoinAndSelect("r.nivelAcademicoTipo", "na")
        .innerJoinAndSelect("r.intervaloGestionTipo", "ig")
        .select([
            'ca.id as carrera_autorizada_id',
            'ct.carrera as carrera',
            'at.area as area',
            'r.numero_resolucion as numero_resolucion',
            'r.fecha_resolucion as fecha_resolucion',
            'r.tiempo_estudio as tiempo_estudio',
            'r.carga_horaria as carga_horaria',
            'r.resuelve as resuelve',
            'na.nivel_academico as nivel_academico',
            'ig.intervalo_gestion as intervalo_gestion',
        ])
          .where("s.id = :id ", { id })
          .getRawMany();
    }

    async geAllCarrerasByIeId(id){
        return await this.dataSource
          .getRepository(CarreraAutorizada)
          .createQueryBuilder("ca")
          .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
          .innerJoinAndSelect("ca.carreraTipo", "ct")
          .innerJoinAndSelect("ca.areaTipo", "at")
          //.leftJoinAndSelect("ca.institutosPlanesCarreras", "ipec")
          .innerJoinAndSelect("ca.resoluciones", "r")
          .innerJoinAndSelect("r.resolucionTipo", "rt")
          .innerJoinAndSelect("r.nivelAcademicoTipo", "na")
          .innerJoinAndSelect("r.intervaloGestionTipo", "ig")
          .select([
            "ca.id as carrera_autorizada_id",
            "ct.carrera as carrera",
            "ct.id as carrera_id",
            "at.area as area",
            "r.numero_resolucion as numero_resolucion",
            "r.fecha_resolucion as fecha_resolucion",
            "r.tiempo_estudio as tiempo_estudio",
            "r.carga_horaria as carga_horaria",
            "r.resuelve as resuelve",
            "na.nivel_academico as nivel_academico",
            "ig.intervalo_gestion as regimen_estudio",
            "rt.resolucion_tipo as tipo_tramite",
            //"ipec.id as instituto_plan_estudio_carrera_id",
          ])
          .where("s.institucionEducativaId = :id ", { id })
          .andWhere("ca.areaTipoId > 1 ")
          .getRawMany();
    }
    async getAllCursosByIeId(id){
        return  await this.dataSource.getRepository(CarreraAutorizada)
        .createQueryBuilder("ca")
        .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
        .innerJoinAndSelect("ca.carreraTipo", "ct")
        .innerJoinAndSelect("ca.areaTipo", "at")
        .innerJoinAndSelect("ca.resoluciones", "r")
        .innerJoinAndSelect("r.resolucionTipo", "rt")
        .innerJoinAndSelect("r.nivelAcademicoTipo", "na")
        .innerJoinAndSelect("r.intervaloGestionTipo", "ig")
        .select([            
            'ca.id as carrera_autorizada_id',
            'ct.id as carrera_id',
            'ct.carrera as carrera',
            'at.area as area',
            'r.numero_resolucion as numero_resolucion',
            'r.fecha_resolucion as fecha_resolucion',
            'r.tiempo_estudio as tiempo_estudio',
            'r.carga_horaria as carga_horaria',
            'r.resuelve as resuelve',
            'na.nivel_academico as nivel_academico',
            'ig.intervalo_gestion as regimen_estudio',
            'rt.resolucion_tipo as tipo_tramite',
        ])
          .where("s.institucionEducativaId = :id ", { id })
          .andWhere("at.id = 1 ")
          .getRawMany();
    }

    async getCarreraAutorizadaById(id){
        
        return  await this.dataSource.getRepository(CarreraAutorizada)
        .createQueryBuilder("ca")
        .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
        .innerJoinAndSelect("s.institucionEducativa", "i")
        .innerJoinAndSelect("ca.carreraTipo", "ct")
        .innerJoinAndSelect("ca.areaTipo", "at")
        .innerJoinAndSelect("ca.resoluciones", "r")
        .innerJoinAndSelect("r.resolucionTipo", "rt")
        .innerJoinAndSelect("r.nivelAcademicoTipo", "na")
        .innerJoinAndSelect("r.intervaloGestionTipo", "ig")
        .select([
            'i.id as ie_id',
            's.id as sucursal_id',
            'i.institucion_educativa as institucion_educativa',
            'ca.id as carrera_autorizada_id',
            'ct.carrera as carrera',
            'ct.id as carrera_id',
            'at.area as area',
            'at.id as area_id',
            'r.numero_resolucion as numero_resolucion',
            'r.fecha_resolucion as fecha_resolucion',
            'r.tiempo_estudio as tiempo_estudio',
            'r.carga_horaria as carga_horaria',
            'r.resuelve as resuelve',
            'na.nivel_academico as nivel_academico',
            'na.id as nivel_academico_tipo_id',
            'ig.intervalo_gestion as regimen_estudio',
            'ig.id as intervalo_gestion_tipo_id',
            'rt.resolucion_tipo as tipo_tramite',
            'rt.id as resolucion_tipo_id',
        ])
          .where("ca.id = :id", { id })
          .andWhere("ca.activo = true")
          .getRawOne();

    }

    async createAutorizada(
        dto: CreateCarreraAutorizadaResolucionDto, 
        transaction: EntityManager
        ) {
        const ca = new CarreraAutorizada();
        ca.institucionEducativaSucursalId = dto.sucursal_id;
        ca.carreraTipoId = dto.carrera_tipo_id;
        ca.areaTipoId = dto.area_tipo_id;
        ca.usuarioId = 1;// dto.usuarioId;
        ca.activo = true;
        const result = await transaction.getRepository(CarreraAutorizada).save(ca);
       
        return result;
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
