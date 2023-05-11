import { Injectable } from '@nestjs/common'
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
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
            'ig.intervalo_gestion as regimen_estudio',
            'rt.resolucion_tipo as tipo_tramite',
        ])
          .where("s.institucionEducativaId = :id ", { id })
          .getRawMany();
    }
    async geCarreraById(id){
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
            'i.institucion_educativa as institucion_educativa',
            'ca.id as carrera_autorizada_id',
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
          .where("ca.id = :id ", { id })
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
