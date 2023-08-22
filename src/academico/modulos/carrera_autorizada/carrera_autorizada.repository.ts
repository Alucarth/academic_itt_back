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
          .andWhere("r.ultimo = true ")
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
          .orderBy("r.fechaResolucion", "DESC")
          .andWhere("r.ultimo = true")
          .getRawOne();

    }

    async createAutorizada(
        usuarioId,
        dto: CreateCarreraAutorizadaResolucionDto, 
        transaction: EntityManager
        ) {
        const ca = new CarreraAutorizada();
        ca.institucionEducativaSucursalId = dto.sucursal_id;
        ca.carreraTipoId = dto.carrera_tipo_id;
        ca.areaTipoId = dto.area_tipo_id;
        ca.usuarioId = usuarioId;// dto.usuarioId;
        ca.activo = true;
        const result = await transaction.getRepository(CarreraAutorizada).save(ca);
       
        return result;
    }
   
    async findTotalCarreras(){
        const carreras = await this.dataSource.getRepository(CarreraAutorizada)
        .createQueryBuilder("ca")
        .innerJoin("ca.carreraTipo", "c")
        .where('ca.area_tipo_id>1')
        .getCount();
       // console.log(carreras);
        return carreras;
    }
    async findTotalDependencias(){
        
        const list = await this.dataSource.getRepository(CarreraAutorizada)
        .createQueryBuilder("ca")
        .innerJoin("ca.institucionEducativaSucursal", "s")
        .innerJoin("s.institucionEducativa", "a")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "h")
        .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .innerJoin("a.acreditados", "e")
        .innerJoin("e.dependenciaTipo", "g")
        .select([
            "up4.lugar as departamento",
            "up4.id as departamento_id",
            "g.dependencia as dependencia",
            "g.id as dependencia_id",
            "COUNT(ca.id) as total",  
        ])
        .where('a.educacionTipoId in (7,8,9)')
        .andWhere('a.estadoInstitucionEducativaTipoId in (10)') //abierta
        .andWhere('ca.areaTipoId > 1')
        .groupBy('up4.id')
        .addGroupBy('g.dependencia')
        .addGroupBy('g.id')
        .getRawMany();
        //.getMany();
        return list;
    }
    async findListaCarreras(){ // las TOP 20
        const carreras = await this.dataSource.getRepository(CarreraAutorizada)
        .createQueryBuilder("ca")
        .innerJoin("ca.carreraTipo", "c")
        .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
        .select([
            'c.carrera as carrera',
            'COUNT(ca.carreraTipoId) as total'
        ])
        .where('ca.area_tipo_id>1')
        .limit(20)
        .groupBy('c.carrera')
        .orderBy('total', 'DESC')
        .getRawMany();
       // console.log(carreras);
        return carreras;
    }

    async findListaCarrerasEstudiantes(id){
        return await this.dataSource
          .getRepository(CarreraAutorizada)
          .createQueryBuilder("ca")
          .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
          .innerJoinAndSelect("ca.carreraTipo", "ct")
          .innerJoinAndSelect("ca.institutosPlanesCarreras", "ipec")
          .innerJoinAndSelect("ipec.matriculasEstudiantes", "m")
          .select([
            "ct.carrera as carrera",
            "COUNT(distinct(m.institucionEducativaEstudianteId)) as total",
          ])
          .where("s.institucionEducativaId = :id ", { id })
          .groupBy('ct.carrera')
          .getRawMany();
    }
    /***total de carrera, total paralelos, total estudiantes */
    async findListParalelosaCarrerasEstudiantes(id){
        return await this.dataSource
          .getRepository(CarreraAutorizada)
          .createQueryBuilder("ca")
          .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
          .innerJoinAndSelect("ca.carreraTipo", "ct")
          .innerJoinAndSelect("ca.institutosPlanesCarreras", "ipec")
          .innerJoinAndSelect("ipec.ofertasCurriculares", "o")
          .innerJoinAndSelect("o.aulas", "a")
          .innerJoinAndSelect("ipec.matriculasEstudiantes", "m")
          .select([
            "ct.carrera as carrera",
            "COUNT(distinct(a.id)) as total_aulas",
            "COUNT(distinct(m.institucionEducativaEstudianteId)) as total_estudiantes",
          ])
          .where("s.institucionEducativaId = :id ", { id })
          .groupBy('ct.carrera')
          //.addGroupBy('o.planEstudioAsignaturaId')
          .getRawMany();
    }
    async findListAsignaturaParaleloCarreraEstudiante(id){
        return await this.dataSource
          .getRepository(CarreraAutorizada)
          .createQueryBuilder("ca")
          .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
          .innerJoinAndSelect("ca.carreraTipo", "ct")
          .innerJoinAndSelect("ca.institutosPlanesCarreras", "ipec")
          .innerJoinAndSelect("ipec.ofertasCurriculares", "o")
          .innerJoinAndSelect("o.institutoEstudianteInscripcions", "iei")
          .innerJoinAndSelect("o.planEstudioAsignatura", "pea")
          .innerJoinAndSelect("pea.asignaturaTipo", "a")
          .select([
            "ct.carrera as carrera",
            "a.asignatura as asignatura",
            "COUNT(iei.matriculaEstudianteId) as total_estudiantes",
            "COUNT(distinct(iei.aulaId)) as total_paralelos"
           // "COUNT(distinct(a.id)) as total_aulas",
           // "COUNT(distinct(m.institucionEducativaEstudianteId)) as total_estudiantes",
          ])
          .where("s.institucionEducativaId = :id ", { id })
          .groupBy('ct.carrera')
          .addGroupBy('iei.aulaId')
          .addGroupBy('a.asignatura')
          //.addGroupBy('o.planEstudioAsignaturaId')
          .getRawMany();
    }
    async findListaAsignaturasParaleloEstudiantes(id){
        return await this.dataSource
          .getRepository(CarreraAutorizada)
          .createQueryBuilder("ca")
          .innerJoinAndSelect("ca.institutosPlanesCarreras", "ipec")
          .innerJoinAndSelect("ipec.ofertasCurriculares", "o")
          .innerJoinAndSelect("o.aulas", "au")
          .innerJoinAndSelect("au.paraleloTipo", "pt")
          .innerJoinAndSelect("au.institutoEstudianteInscripcions", "iei")
          .innerJoinAndSelect("o.planEstudioAsignatura", "pea")
          .innerJoinAndSelect("pea.asignaturaTipo", "a")
          .select([
            "a.asignatura as asignatura",
            "pt.paralelo as paralelo",
            "COUNT(iei.matriculaEstudianteId) as total_estudiantes",
          ])
          .where("ca.id = :id ", { id })
          .groupBy('a.asignatura')
          .addGroupBy('pt.id')
          .getRawMany();
    }

    async findListaRegimenCarrerasEstudiantes(lugar,dependencia){
        return await this.dataSource
          .getRepository(CarreraAutorizada)
          .createQueryBuilder("ca")
          .innerJoinAndSelect("ca.resoluciones", "r")
          .innerJoinAndSelect("r.intervaloGestionTipo", "igt")
          .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
          .innerJoinAndSelect("s.institucionEducativa", "i")
          .innerJoinAndSelect("i.jurisdiccionGeografica", "h")
          .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
          .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
          .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
          .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
          .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
          .innerJoinAndSelect("ca.carreraTipo", "ct")
          .leftJoinAndSelect("ca.institutosPlanesCarreras", "ipec")
          .leftJoinAndSelect("ipec.matriculasEstudiantes", "m")
          .innerJoinAndSelect("i.acreditados", "e")
          .select([
            "i.institucion_educativa as institucion_educativa",
            "igt.intervalo_gestion as modalidad",
            "ca.id as carrera_autorizada_id",
            "ct.carrera as carrera",
            "COUNT(distinct(m.institucionEducativaEstudianteId)) as total",
            //"COUNT(distinct(iee.id)) as total",
          ])
          .where('i.educacionTipoId in (7,8,9)')
          .andWhere('ca.areaTipoId > 1')
          .andWhere('e.dependenciaTipoId = :dependencia ', { dependencia })
          .andWhere('up4.id = :lugar ', { lugar })
          .groupBy('ct.carrera')
          .addGroupBy('ca.id')
          .addGroupBy('i.institucion_educativa')
          .addGroupBy('igt.intervalo_gestion')
          .getRawMany();
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }

    async geXlsAllCarrerasByIeId(id){
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
          'ct.carrera as "CARRERA"',         
          'at.area as "AREA"',
          'r.numero_resolucion as "Nro. RESOLUCION"',
          'r.fecha_resolucion as "FECHA RESOLUCION"',
          'r.tiempo_estudio as "TIEMPO ESTUDIO"',
          'r.carga_horaria as "CARGA HORARIA"',
          'r.resuelve as "RESOLUCION"',
          'na.nivel_academico as "NIVEL ACADEMICO"',
          'ig.intervalo_gestion as "REGIMEN ESTUDIO"',
          'rt.resolucion_tipo as "TIPO TRAMITE"',
          //"ipec.id as instituto_plan_estudio_carrera_id",
        ])
        .where("s.institucionEducativaId = :id ", { id })
        .andWhere("ca.areaTipoId > 1 ")
        .getRawMany();
  }

  async geXlsAllCarrerasByIeIdNombre(id){

    const res = await this.dataSource.query(`

    SELECT institucion_educativa       
    FROM
      institucion_educativa
      where id = ${id} 
    `);

    return res[0]['institucion_educativa'];

  }

  async geAllCarrerasByIeIdGestionPeriodo(id, gestion, periodo){
    /*return await this.dataSource.query(`
    SELECT
    carrera_autorizada.id as carrera_autorizada_id, 
    carrera_tipo.carrera, 
    carrera_tipo.id, 
    area_tipo.area as area, 
    carrera_autorizada_resolucion.numero_resolucion, 
    carrera_autorizada_resolucion.fecha_resolucion, 
    carrera_autorizada_resolucion.tiempo_estudio, 
    carrera_autorizada_resolucion.carga_horaria, 
    carrera_autorizada_resolucion.resuelve, 
    nivel_academico_tipo.nivel_academico, 
    intervalo_gestion_tipo.intervalo_gestion as regimen_estudio, 
    resolucion_tipo.resolucion_tipo as tipo_tramite, 
    institucion_educativa_sucursal.id, 
    institucion_educativa_sucursal.institucion_educativa_id, 
    carrera_autorizada.area_tipo_id, 
    operativo_carrera_autorizada.gestion_tipo_id, 
    operativo_carrera_autorizada.periodo_tipo_id
  FROM
    carrera_autorizada
    INNER JOIN
    carrera_tipo
    ON 
      carrera_autorizada.carrera_tipo_id = carrera_tipo.id
    INNER JOIN
    area_tipo
    ON 
      carrera_autorizada.area_tipo_id = area_tipo.id
    INNER JOIN
    carrera_autorizada_resolucion
    ON 
      carrera_autorizada.id = carrera_autorizada_resolucion.carrera_autorizada_id
    INNER JOIN
    nivel_academico_tipo
    ON 
      carrera_autorizada_resolucion.nivel_academico_tipo_id = nivel_academico_tipo.id
    INNER JOIN
    intervalo_gestion_tipo
    ON 
      carrera_autorizada_resolucion.intervalo_gestion_tipo_id = intervalo_gestion_tipo.id
    INNER JOIN
    resolucion_tipo
    ON 
      carrera_autorizada_resolucion.resolucion_tipo_id = resolucion_tipo.id
    INNER JOIN
    institucion_educativa_sucursal
    ON 
      carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
    INNER JOIN
    operativo_carrera_autorizada
    ON 
      carrera_autorizada.id = operativo_carrera_autorizada.carrera_autorizada_id
  WHERE
    institucion_educativa_sucursal.institucion_educativa_id = ${id}
    and operativo_carrera_autorizada.gestion_tipo_id = ${gestion}
    and operativo_carrera_autorizada.periodo_tipo_id = ${periodo}
    `);*/

    return await this.dataSource.query(`

    SELECT distinct 
      institucion_educativa_sucursal.id as institucion_educativa_sucursal_id, 
      institucion_educativa_sucursal.institucion_educativa_id, 
      carrera_autorizada.id as carrera_autorizada_id, 
      carrera_tipo.carrera, 
			(select area from area_tipo where id = carrera_autorizada.carrera_tipo_id ) as area,
      carrera_autorizada_resolucion.descripcion as carrera_autorizada_resolucion_descripcion, 
      carrera_autorizada_resolucion.numero_resolucion as numero_resolucion, 
      carrera_autorizada_resolucion.fecha_resolucion as fecha_resolucion, 
			carrera_autorizada_resolucion.tiempo_estudio, 
			carrera_autorizada_resolucion.carga_horaria, 
			carrera_autorizada_resolucion.resuelve, 
      nivel_academico_tipo.nivel_academico, 
      nivel_academico_tipo.abreviacion, 
      intervalo_gestion_tipo.intervalo_gestion as regimen_estudio, 
			(select resolucion_tipo from resolucion_tipo where id =  carrera_autorizada_resolucion.resolucion_tipo_id ) as tipo_tramite,
      instituto_plan_estudio_carrera.id as instituto_plan_estudio_carrera_id, 
      instituto_plan_estudio_carrera.plan_estudio_carrera_id, 
      instituto_plan_estudio_carrera.carrera_autorizada_id as instituto_plan_estudio_carrera_carrera_autorizada_id, 
      plan_estudio_resolucion.id as plan_estudio_resolucion_id, 
      plan_estudio_resolucion.descripcion as plan_estudio_resolucion_descripcion, 
      plan_estudio_resolucion.numero_resolucion as plan_estudio_resolucion_numero_resolucion, 
      CAST(plan_estudio_resolucion.fecha_resolucion AS TEXT) as plan_estudio_resolucion_fecha_resolucion, 
      plan_estudio_resolucion.activo,
      plan_estudio_resolucion.descripcion,
			operativo_carrera_autorizada.gestion_tipo_id, 
			operativo_carrera_autorizada.periodo_tipo_id
    FROM
      carrera_autorizada
      INNER JOIN
      institucion_educativa_sucursal
      ON 
        carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
      INNER JOIN
      carrera_tipo
      ON 
        carrera_autorizada.carrera_tipo_id = carrera_tipo.id
      INNER JOIN
      carrera_autorizada_resolucion
      ON 
        carrera_autorizada.id = carrera_autorizada_resolucion.carrera_autorizada_id
      INNER JOIN
      nivel_academico_tipo
      ON 
        carrera_autorizada_resolucion.nivel_academico_tipo_id = nivel_academico_tipo.id
      INNER JOIN
      intervalo_gestion_tipo
      ON 
        carrera_autorizada_resolucion.intervalo_gestion_tipo_id = intervalo_gestion_tipo.id
      INNER JOIN
      instituto_plan_estudio_carrera
      ON 
        carrera_autorizada.id = instituto_plan_estudio_carrera.carrera_autorizada_id
      INNER JOIN
      plan_estudio_carrera
      ON 
        carrera_tipo.id = plan_estudio_carrera.carrera_tipo_id AND
        instituto_plan_estudio_carrera.plan_estudio_carrera_id = plan_estudio_carrera.id AND
        intervalo_gestion_tipo.id = plan_estudio_carrera.intervalo_gestion_tipo_id AND
        nivel_academico_tipo.id = plan_estudio_carrera.nivel_academico_tipo_id AND
        plan_estudio_carrera.activo = true
      INNER JOIN
      plan_estudio_resolucion
      ON 
        plan_estudio_carrera.plan_estudio_resolucion_id = plan_estudio_resolucion.id and
        plan_estudio_resolucion.activo = true
			INNER JOIN
    operativo_carrera_autorizada
    ON 
      carrera_autorizada.id = operativo_carrera_autorizada.carrera_autorizada_id
  WHERE
    institucion_educativa_sucursal.institucion_educativa_id = ${id}
    and operativo_carrera_autorizada.gestion_tipo_id = ${gestion}
    and operativo_carrera_autorizada.periodo_tipo_id = ${periodo}
    `);
     
}


}
