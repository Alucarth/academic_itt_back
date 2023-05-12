import { Injectable } from '@nestjs/common'
import { PlanEstudioCarrera } from 'src/academico/entidades/planEstudioCarrera.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class PlanEstudioCarreraRepository {
    
    constructor(private dataSource: DataSource) {}

    async getResolucionesAll(){
        return  await this.dataSource.getRepository(PlanEstudioCarrera).find();
    }
    async findCarreraById(id:number){
        console.log("muestra");
        const resultado = await this.dataSource.getRepository(PlanEstudioCarrera).findOneBy({id:id});
        console.log(resultado);
        return  resultado;
    }
    async findCarrerasByResolucionId(id){
        return  await this.dataSource.getRepository(PlanEstudioCarrera)
        .createQueryBuilder("pc")
        .innerJoinAndSelect("pc.planEstudioResolucion", "r")
        .innerJoinAndSelect("pc.carreraTipo", "ct")
        .innerJoinAndSelect("pc.areaTipo", "at")
        .innerJoinAndSelect("pc.nivelAcademicoTipo", "na")
        .innerJoinAndSelect("pc.intervaloGestionTipo", "ig")
        .select([
            'pc.id as plan_estudio_carrera_id',
            'r.id as carrera_resolucion_id',
            'ct.carrera as carrera',
            'ct.id as carrera_id',
            'at.area as area',
            'at.id as area_id',
            'pc.tiempo_estudio as tiempo_estudio',
            'pc.carga_horaria as carga_horaria',
            'pc.denominacion as denominacion',
            'pc.descripcion as descripcion',
            'na.nivel_academico as nivel_academico',
            'na.id as nivel_academico_tipo_id',
            'ig.intervalo_gestion as regimen_estudio',
            'ig.id as intervalo_gestion_tipo_id',
        ])
          .where("r.id = :id ", { id })
          .getRawMany();

    }
    async findResolucionesByData(
        carrera_id:number,
        nivel_id:number,
        area_id:number,
        intervalo_id:number,
        tiempo:number,
        ){
            console.log("carrera es");
            console.log(carrera_id);
        return  await this.dataSource.getRepository(PlanEstudioCarrera)
        .createQueryBuilder("pc")
        .innerJoinAndSelect("pc.planEstudioResolucion", "r")
        .select([
            'pc.id as plan_estudio_carrera_id',
            'r.id as plan_estudio_resolucion_id',
            'r.numero_resolucion as numero_resolucion',
            'r.fecha_resolucion as fecha_resolucion',
            'r.activo as activo',
        ])
          .where("pc.carreraTipoId = :carrera_id ", { carrera_id })
          //.where("pc.areaTipoId = :area_id ", { area_id })
          //.where("pc.nivelAcademicoTipoId = :nivel_id ", { nivel_id })
          //.where("pc.intervaloGestionTipoId = :intervalo_id ", { intervalo_id })
          //.where("pc.tiempoEstudio = :tiempo ", { tiempo })
          .getRawMany();

    }
   
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
