import { Injectable } from '@nestjs/common'
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';

@Injectable()
export class CarreraAutorizadaResolucionRepository {
    
    constructor(private dataSource: DataSource) {}

    async getOneBy(id){
        return  await this.dataSource.getRepository(CarreraAutorizadaResolucion).findBy({ id: id });
        
    }
    async getAll(){
        return  await this.dataSource.getRepository(CarreraAutorizadaResolucion).find();
        
    }
    async getDatoCarreraAutorizadaResolucion(dto: CreateCarreraAutorizadaResolucionDto){

        let tiempoEstudio = dto.tiempo_estudio;
        let cargaHoraria =dto.carga_horaria;
        let nivelAcademicoTipoId = dto.nivel_academico_tipo_id;
        let intervaloGestionTipoId = dto.intervalo_gestion_tipo_id;        
        let numeroResolucion = dto.numero_resolucion;
        let fechaResolucion = dto.fecha_resolucion;
        let carreraTipoId = dto.carrera_tipo_id;
        let areaTipoId = dto.area_tipo_id;
        let institucionEducativaSucursalId = dto.sucursal_id;

        const carreras_resoluciones = await this.dataSource.getRepository(CarreraAutorizadaResolucion)
        .createQueryBuilder("ca")
        .innerJoinAndSelect("ca.carreraAutorizada", "c")
        .select([
            'ca.tiempo_estudio',
            'ca.carga_horaria',
            'ca.nivel_academico_tipo_id',
            'ca.intervalo_gestion_tipo_id',
            'ca.ultimo',
            'ca.numero_resolucion',
            'ca.fecha_resolucion',
            
        ])
        .where('ca.ultimo=true')
        .andWhere("ca.tiempo_estudio = :tiempoEstudio ", { tiempoEstudio})
        .andWhere("ca.cargo_tiempo = :cargaHoraria ", { cargaHoraria})
        .andWhere("ca.nivel_academico_tipo_id = :nivelAcademicoTipoId ", { nivelAcademicoTipoId})
        .andWhere("ca.intervalo_gestion_tipo_id = :intervaloGestionTipoId ", { intervaloGestionTipoId})
        .andWhere("ca.numero_resolucion = :numeroResolucion ", { numeroResolucion})
        .andWhere("ca.fecha_resolucion = :fechaResolucion ", { fechaResolucion})
        .andWhere("ca.carrera_autorizada_id = :fechaResolucion ", { fechaResolucion})
        .andWhere("c.carrera_tipo_id = :carreraTipoId ", { carreraTipoId})
        .andWhere("c.area_tipo_id = :areaTipoId ", { areaTipoId})
        .andWhere("c.institucionEducativaSucursal = :institucionEducativaSucursalId ", { institucionEducativaSucursalId})
        .getRawOne();
        return carreras_resoluciones;
        
    }
   
  async crearCarreraResolucion(
    usuarioId,
    id,
    dto: CreateCarreraAutorizadaResolucionDto, 
    transaction: EntityManager,
    
    ) {
    const car = new CarreraAutorizadaResolucion();
    car.carreraAutorizadaId = id;
    car.numeroResolucion = dto.numero_resolucion;
    car.fechaResolucion = dto.fecha_resolucion;
    car.resolucionTipoId = dto.resolucion_tipo_id;
    car.resolucionTipoId = dto.resolucion_tipo_id;
    car.path = '';
    car.resuelve = dto.resuelve;
    car.tiempoEstudio = dto.tiempo_estudio;
    car.cargaHoraria = dto.carga_horaria;
    car.nivelAcademicoTipoId = dto.nivel_academico_tipo_id;
    car.intervaloGestionTipoId = dto.intervalo_gestion_tipo_id;
    car.descripcion =  dto.descripcion;
    car.usuarioId = usuarioId;// dto.usuarioId;

    const result = await transaction.getRepository(CarreraAutorizadaResolucion).save(car);
   
    return result;
}
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
