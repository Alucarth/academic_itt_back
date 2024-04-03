import { Injectable } from '@nestjs/common'
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DataSource, EntityManager, In } from 'typeorm'
import { CreateInstitucionEducativaDto } from './dto/createInstitucionEducativa.dto';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { MatriculaEstudiante } from 'src/academico/entidades/matriculaEstudiante.entity';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';


@Injectable()
export class InstitucionEducativaRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(InstitucionEducativa).find();
    }

   
    async getAllItt(){
        const itts = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .where('b.id in (7,8,9)')
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log(itts);
        return itts;
    }
    async findTotalItt(){
        const itts = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .where('b.id in (7,8,9)')
        .andWhere('a.estadoInstitucionEducativaTipoId = 10')
        .getCount();
        console.log(itts);
        return itts;
    }
   
    async getBySieId(id:number){
        const itt = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .where('a.id = :id ', { id })
        .getOne();
        return itt;
      
    }
    async findInstitucionEducativaInstituto( id:number ){
        const itts = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("a.educacionTipo", "d")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "e")
        .where('a.educacionTipo in (7,8,9,11,12,13)')
        .andWhere('c.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getOne();
        return itts;
    }
    async findInstitucionEducativaLugarNombre( id:number, nombre:string ){
        const itts = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("a.educacionTipo", "d")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "e")
        .where('a.educacionTipo in (7,8,9,11,12,13)')
        .andWhere('c.id = :id ', { id })
        .andWhere('a.institucionEducativa = :nombre ', { nombre })
        .orderBy('a.id', 'ASC')
        .getOne();
        return itts;
    }
    async findBySie( id:number ){
        const itts = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        //.innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("a.sucursales", "d")
        .leftJoinAndSelect("a.acreditados", "e")
        .leftJoinAndSelect("e.convenioTipo", "f")
        .leftJoinAndSelect("e.dependenciaTipo", "g")
        .leftJoinAndSelect("e.acreditacionTipo", "h")
        .select(["a","c","d","e","f","g","h"])
        .where('a.educacionTipo in (7,8,9)  ')
        .andWhere('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itts;
    }
    async findAcreditacionBySie( id:number ){
        const itts = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("a.sucursales", "d")
        .innerJoinAndSelect("a.acreditados", "e")
        .where('b.id in (7,8,9)  ')
        .where('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itts;
    }
    async findOneAcreditadoBySie( id:number ){
        console.log(id);
        const itt = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "c")
        .innerJoinAndSelect("a.acreditados", "e")
        .innerJoinAndSelect("a.sucursales", "j")
        .innerJoinAndSelect("e.convenioTipo", "f")
        .innerJoinAndSelect("e.dependenciaTipo", "g")
        .innerJoinAndSelect("e.acreditacionTipo", "i")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "h")
        .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        // .innerJoinAndSelect("a.imagenes", "img")
        .select([
            'a.id as ie_id',
            'j.id as sucursal_id',
            'a.institucion_educativa as institucion_educativa',
            'e.numeroResolucion as numero_resolucion',
            'e.fechaResolucion as fecha_resolucion',
            'g.dependencia as caracter_juridico',
            'g.id as dependencia_id',
            'b.educacion as tipo_institucion',
            'c.estadoInstitucionEducativa as estado',
            'i.acreditacion as acreditacion',
            'a.observacion as observacion',
            'h.codigoEdificioEducativo as cod_le',
            'h.cordx as cordx',
            'h.cordy as cordy',
            'h.direccion as direccion',
            'h.zona as zona',
            'u1.lugar as localidad',
            'up1.lugar as canton',
            'up2.lugar as municipio',
            'up3.lugar as provincia',
            'up4.lugar as departamento',
            'up4.id as departamento_id',
            'j.sucursal_nombre as sede_subsede',
            'e.id as acreditacion_id',
            'j.id as sucursal_id',
            // 'img.nombreArchivo as file',
        ])
        .where('b.id in (7,8,9,11,12,13)  ')
        .andWhere('a.id = :id ', { id })
        .andWhere('e.vigente = :vigente ', { vigente: 'TRUE'})
        // .andWhere('img.activo = :vigente ', { vigente: 'TRUE'})
        .orderBy('a.id', 'ASC')
        //.getOneOrFail();
        .getRawOne();
        return itt;
    }
    async findEspecialidadBySie( id:number ){
        const itts = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .where('b.id in (7,8,9)  ')
        .where('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itts;
    }
    async findEtapasBySie( id:number ){
        const carreras = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.acreditados", "b")
        .innerJoinAndSelect("b.acreditadosEtapasEducativas", "c")
        .innerJoinAndSelect("c.etapaEducativa", "d")
        .where('a.id = :id ', { id })
        .andWhere('d.etapaEducativaTipo = 28 ') //PARA SOLO MOSTRAR LA CARRER
        .orderBy('a.id', 'ASC')
        .getMany();
        return carreras;
    }

    async findCarrerasBySie( id:number ){
        const values = ['etapa_educativa_tipo',25,28,id,'etapa_educativa','codigo','etapa_educativa','etapa_educativa_tipo_id'];
        const sql = 'select * from sp_genera_acreditacion_oferta_json($1,$2,$3,$4,$5,$6,$7,$8)';
        const data = await this.dataSource.getRepository(InstitucionEducativa).query(sql, values);
        console.log(data);
        return data;
    }
    async findSucursalGestion( sie:number, gestion:number ){
        console.log("consulta");
        console.log(sie);
        console.log(gestion);
        const sucursal = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.sucursales", "b")
        .innerJoinAndSelect("b.gestionTipo", "g")
        .select(['a.id as id','a.institucionEducativa as institucion_educativa', 'b.id as sucursal_id'])
        .where('a.id = :id ', { id: sie })
        .andWhere('g.id = :gestion ', { gestion : gestion }) //PARA SOLO MOSTRAR LA CARRER
        .getRawOne();
        return sucursal;
    }

    async getCodigo(id) {
        const values = [
          id
        ];
        /*
        const sql =
          "select * from sp_genera_codigo($1)";
        const data = await this.dataSource.getRepository(JurisdiccionGeografica).query(sql, values);*/
       // console.log(data);
        //return data;
        
        return Math.floor(Math.random() * 1000000000);
      }

    async insertInstitucionEducativa(
        dto: CreateInstitucionEducativaDto, 
        transaction: EntityManager
        ) {
            console.log("en repo");
            console.log(dto);
            console.log("fin en repo");
            const institucion = new InstitucionEducativa();
            institucion.id =dto.codigo;
            institucion.jurisdiccionGeograficaId = dto.jurisdiccion_geografica_id;
            institucion.institucionEducativa = dto.institucion_educativa;
            institucion.educacionTipoId = dto.educacion_tipo_id;
            institucion.estadoInstitucionEducativaTipoId = 10;
            institucion.fechaFundacion = dto.fecha_resolucion;
            return await transaction.getRepository(InstitucionEducativa).save(institucion);
        
    }

    async crearInstitucionEducativa(
        dto: CreateInstitucionEducativaDto, 
        transaction: EntityManager
        ) {
           
        const institucion = new InstitucionEducativa();
        institucion.id = dto.codigo;
        institucion.jurisdiccionGeograficaId = dto.jurisdiccion_geografica_id;
        institucion.institucionEducativa = dto.institucion_educativa;
        institucion.educacionTipoId = dto.educacion_tipo_id;
        institucion.estadoInstitucionEducativaTipoId = 10;
        institucion.fechaFundacion = dto.fecha_resolucion;
       // institucion.usuarioId = 1;// dto.usuarioId;

        const result = await transaction.getRepository(InstitucionEducativa).save(institucion);
        console.log(dto.codigo);
        console.log(result);
            console.log("ultimo---reg");
        return result;
    }

    async updateInstitucionEducativa(
        id:number,
        dto: CreateInstitucionEducativaDto, 
        transaction: EntityManager
        ) {
            return transaction.getRepository(InstitucionEducativa)
            .createQueryBuilder()
            .update(InstitucionEducativa)
            .set({
                jurisdiccionGeograficaId: dto.jurisdiccion_geografica_id,
                institucionEducativa : dto.institucion_educativa,
                educacionTipoId : dto.educacion_tipo_id,
                fechaFundacion : dto.fecha_resolucion
            })
            .where({ id: id })
            .execute();
    }
/*
    async deleteCursoOferta(
        id: number, 
        transaction: EntityManager){
        
        await  transaction
         .getRepository(OfertaAcademica)
         .createQueryBuilder('OfertaAcademica')
         .delete()
         .from(OfertaAcademica)
         .where('institucion_educativa_curso_id = :id', { id:id })
         .execute();
         
       return await  transaction.getRepository(InstitucionEducativaCurso).delete(id)

    }*/

    async findTotalDependencias(){
        
        const list = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
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
            "COUNT(distinct(a.id)) as total",  
        ])
        .where('a.educacionTipoId in (7,8,9)')
        .andWhere('a.estadoInstitucionEducativaTipoId = 10')
        .groupBy('up4.id')
        .addGroupBy('g.dependencia')
        .addGroupBy('g.id')
        .getRawMany();
        //.getMany();
        return list;
    }

    async findListaInstitutosAreaGeografica()
    {
        return await this.dataSource.query(`select ut5.lugar as departamento, ut5.id as departamento_id, ut.area_geografica_tipo_id ,agt.area_geografica ,  count(distinct(ie.id)) as total   from institucion_educativa ie  
        inner join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
        inner join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
        inner join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
        inner join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
        inner join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
        inner join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
        inner join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
        inner join educacion_tipo et on ie.educacion_tipo_id = et.id
        inner join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
        inner join area_geografica_tipo agt on ut.area_geografica_tipo_id  = agt.id
        where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10 
        group by ut5.id, ut5.lugar, ut.area_geografica_tipo_id, agt.area_geografica  ;
        `)
    }

    async findListaCarrerasInstitutosDependencia()
    {
        return await this.dataSource.query(`select lugar as departamento ,dependencia,educacion, count(total) as total from (
            select ut5.id, ut5.lugar,dt.dependencia, et.educacion  , dt.id,ct.carrera, count(ca.carrera_tipo_id) as total from carrera_autorizada ca
            join carrera_tipo ct on ct.id  = ca.carrera_tipo_id 
            join institucion_educativa_sucursal ies on ies.id = ca.institucion_educativa_sucursal_id 
            join institucion_educativa ie on ie.id  = ies.institucion_educativa_id 
            join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg.id 
            join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id
            join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id  
            join unidad_territorial ut3 on ut2.unidad_territorial_id = ut3.id
            join unidad_territorial ut4 on ut3.unidad_territorial_id = ut4.id
            join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
            join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
            join educacion_tipo et on ie.educacion_tipo_id = et.id
            join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
            where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10 
            group by  ca.carrera_tipo_id,ct.carrera ,ut5.id, ut5.lugar,dt.dependencia , dt.id, et.educacion
            ) as subquery group by lugar, dependencia,educacion;`)
    }

    async findDetalleInstitutosAreaGeografica()
    {
        return await this.dataSource.query(`select ut5.lugar as departamento, dt.dependencia, ie.institucion_educativa, et.educacion as tipo,agt.area_geografica , count(distinct(ie.id)) as total   from institucion_educativa ie  
        inner join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
        inner join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
        inner join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
        inner join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
        inner join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
        inner join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
        inner join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
        inner join educacion_tipo et on ie.educacion_tipo_id = et.id
        inner join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
        inner join area_geografica_tipo agt on ut.area_geografica_tipo_id = agt.id
        where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10 
        group by ut5.id, ut5.lugar, dt.dependencia , dt.id, ie.institucion_educativa, et.educacion , agt.area_geografica  ;
        `)
    }

    async findInscritosInsitutosDependenciaDepartamento()
    {
        return await this.dataSource.query(`select lugar,dependencia, sum(total) as total from (
            select ut5.id, ut5.lugar,ie.id, dt.dependencia , dt.id, ie.institucion_educativa,count(distinct(iee.persona_id)) as total from instituto_estudiante_inscripcion iei
            join matricula_estudiante me on iei.matricula_estudiante_id = me.id
            join institucion_educativa_estudiante iee on me.institucion_educativa_estudiante_id = iee.id 
            join institucion_educativa_sucursal ies on iee.institucion_educativa_sucursal_id = ies.id
            join institucion_educativa ie on ies.institucion_educativa_id = ie.id
            join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
            join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
            join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
            join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
            join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
            join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
            join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
            join educacion_tipo et on ie.educacion_tipo_id = et.id
            join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
            where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10 
            group by ie.id, ie.institucion_educativa,ut5.id, ut5.lugar, dt.dependencia , dt.id 
            ) as subquery group  by lugar, dependencia;
            `)
    }

    async findEstudiantesTipoCarreraDependenciaAnual()
    {
        return await this.dataSource.query(`select dependencia,educacion, sum(total) as total from (
            select ut5.id, ut5.lugar,ie.id, dt.dependencia , dt.id, et.educacion  ,ie.institucion_educativa,count(distinct(iee.persona_id)) as total from matricula_estudiante me 
            join plan_estudio_carrera pec on me.instituto_plan_estudio_carrera_id = pec.id
            join institucion_educativa_estudiante iee on me.institucion_educativa_estudiante_id = iee.id 
            join institucion_educativa_sucursal ies on iee.institucion_educativa_sucursal_id = ies.id
            join institucion_educativa ie on ies.institucion_educativa_id = ie.id
            join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
            join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
            join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
            join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
            join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
            join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
            join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
            join educacion_tipo et on ie.educacion_tipo_id = et.id
            join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
            where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10 and pec.intervalo_gestion_tipo_id = 4
            group by ie.id, ie.institucion_educativa,ut5.id, ut5.lugar, dt.dependencia , dt.id, et.educacion  
            ) as subquery group by dependencia, educacion;`)
    }

    async findEstudiantesTipoCarreraDependenciaSemestre()
    {
        return await this.dataSource.query(`select dependencia,educacion, sum(total) as total from (
            select ut5.id, ut5.lugar,ie.id, dt.dependencia , dt.id, et.educacion  ,ie.institucion_educativa,count(distinct(iee.persona_id)) as total from matricula_estudiante me 
            join plan_estudio_carrera pec on me.instituto_plan_estudio_carrera_id = pec.id
            join institucion_educativa_estudiante iee on me.institucion_educativa_estudiante_id = iee.id 
            join institucion_educativa_sucursal ies on iee.institucion_educativa_sucursal_id = ies.id
            join institucion_educativa ie on ies.institucion_educativa_id = ie.id
            join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
            join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
            join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
            join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
            join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
            join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
            join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
            join educacion_tipo et on ie.educacion_tipo_id = et.id
            join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
            where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10 and pec.intervalo_gestion_tipo_id = 1
            group by ie.id, ie.institucion_educativa,ut5.id, ut5.lugar, dt.dependencia , dt.id, et.educacion  
            ) as subquery group by dependencia, educacion;`)
    }

    async findEstudiantesDepartamentoGenero()
    {
        return await this.dataSource.query(`select lugar, genero, sum(total) as total from( 
            select ut5.id, ut5.lugar,ie.id, ie.institucion_educativa,gt.genero,count(distinct(iee.persona_id)) as total from instituto_estudiante_inscripcion iei
            join matricula_estudiante me on iei.matricula_estudiante_id = me.id
            join institucion_educativa_estudiante iee on me.institucion_educativa_estudiante_id = iee.id 
            join institucion_educativa_sucursal ies on iee.institucion_educativa_sucursal_id = ies.id
            join institucion_educativa ie on ies.institucion_educativa_id = ie.id
            join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
            join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
            join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
            join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
            join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
            join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
            join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
            join educacion_tipo et on ie.educacion_tipo_id = et.id
            join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
            join persona p on iee.persona_id = p.id 
            join genero_tipo gt on p.genero_tipo_id = gt.id
            group by ie.id, ie.institucion_educativa,ut5.id, ut5.lugar, gt.genero
            ) as subquery group by lugar, genero;`)
    }

    async findDetalleCarrerasInsitutosDependencia()
    {
        return await this.dataSource.query(`select ct.carrera ,ie.institucion_educativa, ut5.lugar as departamento, dt.dependencia , ut3.lugar as municipio from carrera_autorizada ca 
        join carrera_tipo ct on ca.carrera_tipo_id = ct.id
        join institucion_educativa_sucursal ies on ca.institucion_educativa_sucursal_id = ies.id
        join institucion_educativa ie on ie.id = ies.institucion_educativa_id 
        join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
        join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
        join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
        join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
        join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
        join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
        join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
        join dependencia_tipo dt on iea.dependencia_tipo_id  = dt.id 
        where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10
        group by ct.carrera, ie.institucion_educativa,ut5.lugar, dt.dependencia, ut3.lugar;`)
    }

    async getDetalleCarreraTipo()
    {
        return await this.dataSource.query(`select et.educacion , count(distinct (ca.carrera_tipo_id) ) as total from carrera_autorizada ca 
        join carrera_tipo ct on ca.carrera_tipo_id = ct.id
        join institucion_educativa_sucursal ies on ca.institucion_educativa_sucursal_id = ies.id
        join institucion_educativa ie on ie.id = ies.institucion_educativa_id 
        join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = ie.id
        join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
        join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
        join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
        join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
        join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
        join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
        join educacion_tipo et on ie.educacion_tipo_id = et.id
        where ie.educacion_tipo_id in (7,8,9) and ie.estado_institucion_educativa_tipo_id = 10
        group by et.educacion  ;`)
    }

    async getCantidadEstudianteCarrera()
    {
        return await this.dataSource.query(`select ct.carrera, count( distinct (iee.persona_id) ) as total  from matricula_estudiante me
        join instituto_plan_estudio_carrera ipec on me.instituto_plan_estudio_carrera_id = ipec.id
        join carrera_autorizada ca on ipec.carrera_autorizada_id = ca.id
        join carrera_tipo ct on ca.carrera_tipo_id = ct.id
        join institucion_educativa_estudiante iee on me.institucion_educativa_estudiante_id = iee.id
        group by ct.carrera ;`)
    }

    async findListaInstitutosPorLugarDependencia(lugar, dependencia){
        
        const list = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "h")
        .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .innerJoinAndSelect("a.acreditados", "e")
        .innerJoinAndSelect("a.sucursales", "s")
        .innerJoinAndSelect("s.carreras", "c")
        //.innerJoinAndSelect("s.maestrosInscripciones", "m")
        //.innerJoinAndSelect("m.persona", "p")
        .innerJoinAndSelect("e.dependenciaTipo", "g")
        .select([
            "a.id as institucion_educativa_id",
            "a.institucionEducativa as institucion_educativa",
            "s.sucursalNombre as sucursal_nombre",
         //   "p.nombre as nombre",
         //   "p.paterno as paterno",
         //   "p.materno as materno",
            "COUNT(c.carreraTipoId) as total",  
        ])
        .where('a.educacionTipoId in (7,8,9)')
        .andWhere('c.areaTipoId > 1')
       // .andWhere('m.cargoTipoId in (2)')
        .andWhere('e.dependenciaTipoId = :dependencia ', { dependencia })
        .andWhere('up4.id = :lugar ', { lugar })
        .groupBy('a.id')
        .addGroupBy('s.sucursalNombre')
      ///// .addGroupBy('p.nombre')
       ///// .addGroupBy('p.paterno')
       ///// .addGroupBy('p.materno')
        .getRawMany();
        return list;
    }

    async findListaLugarDependenciasEstudiantes(lugar, dependencia){
        
        const list = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "h")
        .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .innerJoinAndSelect("a.acreditados", "e")
        .innerJoinAndSelect("a.sucursales", "s")
        .leftJoinAndSelect("s.institucionEducativaEstudiantes", "iee")
        .innerJoinAndSelect("e.dependenciaTipo", "g")
        .select([
            "a.id as institucion_educativa_id",
            "a.institucionEducativa as institucion_educativa",
            "s.sucursalNombre as sucursal_nombre",
            "COUNT(iee.id) as total",  
        ])
        .where('a.educacionTipoId in (7,8,9)')
        .andWhere('e.dependenciaTipoId = :dependencia ', { dependencia })
        .andWhere('up4.id = :lugar ', { lugar })
        .groupBy('a.id')
        .addGroupBy('s.sucursalNombre')
        .getRawMany();
        return list;
    }
    
    async findTotalGeneral(){
        
        const list = await this.dataSource.getRepository(InstitucionEducativa)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "h")
        .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .leftJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .leftJoinAndSelect("a.sucursales", "s")
        .leftJoinAndSelect("s.carreras", "c")
        .leftJoinAndSelect("s.maestrosInscripciones", "m")
        .leftJoinAndSelect("s.institucionEducativaEstudiantes", "i")
        .select([
            "up4.lugar as departamento",
            "COUNT(distinct(a.id)) as total_institutos",  
            "COUNT(distinct(m.id)) as total_docentes",  
            "COUNT(distinct(i.id)) as total_estudiantes",  
            "COUNT(distinct(c.id)) as total_carreras",  
        ])
        .where('a.educacionTipoId in (7,8,9)') //solo tecnicos y tecnológicos
        .andWhere('a.estadoInstitucionEducativaTipoId in (10)') //abierta
        .andWhere('c.areaTipoId > 1') //solo carreras
        .groupBy('up4.id')
        .getRawMany();
        return list;
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }

    async getInsititution(institution_id:number)
    {
        console.log(institution_id)
        return await this.dataSource.getRepository(InstitucionEducativa).findOne({
            relations: {
                sucursales: {
                    carreras: {
                        // institutosPlanesCarreras:{
                        //     ofertasCurriculares:{
                        //         aulas:{
                        //             institutoEstudianteInscripcions:true
                        //         }
                        //     }
                        // }
                        institutosPlanesCarreras:true,
                        carreraTipo: true,
                    }
                }
            },
            where:{
                id: institution_id
            }
        })
    }

    async getMatriculadosCarrera(plan_estudio_carrera_id: number)
    {
        console.log('plan_id',plan_estudio_carrera_id)
        return await this.dataSource.createQueryBuilder()
            .select() 
            .from(MatriculaEstudiante,'matricula_estudiante')
            .where('matricula_estudiante.instituto_plan_estudio_carrera_id = :id',{id:plan_estudio_carrera_id})
            .getMany()
    }   

    async getInstitutoPlanEstudioCarrera(carrera_autorizada_id:number)
    {
        console.log('carrera_autorizada_id',carrera_autorizada_id)
        return await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).find({
            relations:{
                ofertasCurriculares:true
            },
            where:{
                carreraAutorizadaId: carrera_autorizada_id
            }
        })
    }

    async getCountStudentInsitution(oferta_ids:any){
        return await this.dataSource.getRepository(InstitutoEstudianteInscripcion).countBy({
            ofertaCurricularId: In(oferta_ids) 
        })
    }

    async getCarreraAutorizadaResolution(carrera_autorizada_id)
    {
        return await this.dataSource.getRepository(CarreraAutorizadaResolucion).findOne({
            relations:{
                intervaloGestionTipo:true 
            },
            where:{
                carreraAutorizadaId: carrera_autorizada_id
            }
        })
    }
}
