import { Injectable } from '@nestjs/common'
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateInstitucionEducativaDto } from './dto/createInstitucionEducativa.dto';


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
        .where('c.id = :id ', { id })
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
        .where('c.id = :id ', { id })
        .where('a.institucionEducativa = :nombre ', { nombre })
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
        .where('a.id = :id ', { id })
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
        .select([
            'a.id as ie_id',
            'j.id as sucursal_id',
            'a.institucion_educativa as institucion_educativa',
            'e.numeroResolucion as numero_resolucion',
            'e.fechaResolucion as fecha_resolucion',
            'g.dependencia as caracter_juridico',
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
            'j.sucursal_nombre as sede_subsede',
            'e.id as acreditacion_id',
            'j.id as sucursal_id',
        ])
        .where('b.id in (7,8,9,11,12,13)  ')
        .andWhere('a.id = :id ', { id })
        .andWhere('e.vigente = :vigente ', { vigente: 'TRUE'})
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
/*
    async updateCurso(
        dto: UpdateInstitucionEducativaCursoDto, 
        transaction: EntityManager
        ) {
            return transaction.getRepository(InstitucionEducativaCurso)
            .createQueryBuilder()
            .update(InstitucionEducativaCurso)
            .set({
              turnoTipoId: dto.turnoTipoId,
              paraleloTipoId: dto.paraleloTipoId,
            })
            .where({ id: dto.id })
            .execute()
    }*/
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
           // "COUNT(up4.id) as departamento_id", 
            "g.dependencia as dependencia",
            "COUNT(e.dependenciaTipoId) as total",  
        ])
        .where('a.educacionTipoId in (7,8,9)')
        .groupBy('up4.id')
        .addGroupBy('g.dependencia')
        .addGroupBy('g.id')
        .getRawMany();
        //.getMany();
        return list;
    }
    
    
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
