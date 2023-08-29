import { Injectable } from '@nestjs/common'
import { PlanEstudioCarrera } from 'src/academico/entidades/planEstudioCarrera.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreatePlanEstudioResolucionDto } from '../plan_estudio_resolucion/dto/createPlanEstudioResolucion.dto';
import { CreatePlanEstudioCarreraDto } from './dto/createPlanEstudioCarrera.dto';

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
    async findCarrerasInstitutosByResolucionId(id){
        return  await this.dataSource.getRepository(PlanEstudioCarrera)
        .createQueryBuilder("pc")
        .innerJoinAndSelect("pc.planEstudioResolucion", "r")
        .innerJoinAndSelect("pc.institutosPlanesCarreras", "i")
        .leftJoinAndSelect("i.ofertasCurriculares", "o")
        .select([
            'pc.id as plan_estudio_carrera_id',
            'r.id as plan_estudio_resolucion_id',
            'i.id as instituto_plan_estudio_carrera_id',
            'i.carreraAutorizadaId as carrera_autorizada_id',
            'i.activo as activo',
            'o.id as oferta_curricular_id',

        ])
          .where("r.id = :id ", { id })
          .getRawMany();

    }
    async findCarreraInstitutoByResolucionId(id:number, ca:number){
        return  await this.dataSource.getRepository(PlanEstudioCarrera)
        .createQueryBuilder("pc")
        .innerJoinAndSelect("pc.planEstudioResolucion", "r")
        .innerJoinAndSelect("pc.institutosPlanesCarreras", "i")
        .select([
            'pc.id as plan_estudio_carrera_id',
            'r.id as plan_estudio_resolucion_id',
            'i.id as instituto_plan_estudio_carrera_id',
            'i.carreraAutorizadaId as carrera_autorizada_id',
            'i.activo as activo',
        ])
          .where("pc.planEstudioResolucionId = :id ", { id })
          .andWhere("i.carreraAutorizadaId = :ca ", { ca })
          .getRawOne();
    }

    async findResolucionesByData(
        carrera_id:number,
        nivel_id:number,
        area_id:number,
        intervalo_id:number,
        tiempo:number,
        carga:number,
        ){
            console.log("carrera es");
            console.log(carrera_id);
        return  await this.dataSource.getRepository(PlanEstudioCarrera)
        .createQueryBuilder("pc")
        .innerJoinAndSelect("pc.planEstudioResolucion", "r")
        //.innerJoinAndSelect("pc.institutosPlanesCarreras", "i")
        .select([
            'pc.id as plan_estudio_carrera_id',
            'r.id as plan_estudio_resolucion_id',
            'r.numero_resolucion as numero_resolucion',
            'r.fecha_resolucion as fecha_resolucion',
            'r.activo as activo',
           // 'i.id as instituto_plan_estudio_carrera_id',
           // 'i.activo as activo_asignacion',

        ])
          .where("pc.carreraTipoId = :carrera_id", { carrera_id })
          .andWhere("pc.areaTipoId = :area_id", { area_id })
          .andWhere("pc.nivelAcademicoTipoId = :nivel_id", { nivel_id })
          .andWhere("pc.intervaloGestionTipoId = :intervalo_id", { intervalo_id })
          .andWhere("pc.tiempoEstudio = :tiempo", { tiempo })
          .andWhere("pc.cargaHoraria = :carga", { carga })
         // .andWhere("i.activo = true")
          .getRawMany();

    }
    async findResolucionesByCarreraAutorizadaData(
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
        .innerJoinAndSelect("pc.institutosPlanesCarreras", "i")
        .select([
            'pc.id as plan_estudio_carrera_id',
            'r.id as plan_estudio_resolucion_id',
            'r.numero_resolucion as numero_resolucion',
            'r.fecha_resolucion as fecha_resolucion',
            'r.activo as activo',
            'i.id as instituto_plan_estudio_carrera_id',
            'i.activo as activo_asignacion',

        ])
          .where("pc.carreraTipoId = :carrera_id", { carrera_id })
          .andWhere("pc.areaTipoId = :area_id", { area_id })
          .andWhere("pc.nivelAcademicoTipoId = :nivel_id", { nivel_id })
          .andWhere("pc.intervaloGestionTipoId = :intervalo_id", { intervalo_id })
          .andWhere("pc.tiempoEstudio = :tiempo", { tiempo })
          .andWhere("i.activo = true")
          .getRawMany();
    }
    
    async findOneResolucionByData(
        resolucion_id:number,
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
            'pc.id as id',
            'r.id as plan_estudio_resolucion_id',
            'r.numero_resolucion as numero_resolucion',
            'r.fecha_resolucion as fecha_resolucion',
            'r.activo as activo',
        ])
          .where("pc.carreraTipoId = :carrera_id", { carrera_id })
          .andWhere("pc.areaTipoId = :area_id", { area_id })
          .andWhere("pc.nivelAcademicoTipoId = :nivel_id", { nivel_id })
          .andWhere("pc.intervaloGestionTipoId = :intervalo_id", { intervalo_id })
          .andWhere("pc.tiempoEstudio = :tiempo", { tiempo })
          .andWhere("pc.planEstudioResolucionId = :resolucion_id", { resolucion_id })
          .andWhere("pc.activo = true")
          .getRawOne();

    }

    async crearPlanCarrera(
        idUsuario:number,
        datos: CreatePlanEstudioCarreraDto,
        transaction: EntityManager,
        ) {
            const pc = new PlanEstudioCarrera();
            pc.planEstudioResolucionId = datos.plan_estudio_resolucion_id;
            pc.carreraTipoId = datos.carrera_tipo_id;
            pc.nivelAcademicoTipoId = datos.nivel_academico_tipo_id;
            pc.areaTipoId = datos.area_tipo_id;
            pc.intervaloGestionTipoId = datos.intervalo_gestion_tipo_id;
            pc.tiempoEstudio = datos.tiempo_estudio;
            pc.cargaHoraria = datos.carga_horaria;
            pc.denominacion = datos.denominacion;
            pc.activo = true;
            pc.usuarioId = idUsuario;
            const result = await transaction.getRepository(PlanEstudioCarrera).save(pc);
       
        return result;
    }

   
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
