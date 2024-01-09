import { Injectable } from '@nestjs/common'
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateInstitucionEducativaDto } from '../institucion_educativa/dto/createInstitucionEducativa.dto';


@Injectable()
export class InstitucionEducativaSucursalRepository {
    
    constructor(private dataSource: DataSource) {}

    async findSucursalBySieGestion( sie:number, gestion:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")       
        .where('d.id = :sie ', { sie })
        .andWhere('a.gestionTipo = :gestion ', { gestion })
        .getOne();
        return itt;
    }
    async findSucursalBySieVigente( sie:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")       
        .where('d.id = :sie ', { sie })
        .andWhere('a.vigente = true ')
        .getOne();
        return itt;
    }
   
    async getAllIttSucursales(){
        const sucursales = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("b.educacionTipo", "d")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "e")
        .innerJoinAndSelect("c.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .innerJoinAndSelect("b.acreditados", "s")
        .innerJoinAndSelect("s.dependenciaTipo", "dt")
        .select([
            'a.id as sucursal_id',
            'b.id as ie_id',
            'a.id as acreditacion_id',
            'b.institucionEducativa as institucion_educativa',
            'up4.lugar as departamento',
            'd.educacion as tipo_institucion',
            's.numeroResolucion as numero_resolucion',
            'dt.dependencia as caracter_juridico',
            'a.sucursal_nombre as sede_sebsede',
            'c.codigoEdificioEducativo as cod_le',
            'c.id as id_jurisdiccion',
          ])
        .where('d.id in (7,8,9,11,12,13)  ')
        .andWhere('e.id = 10 ')
        .andWhere('s.vigente = true ')
        .orderBy('a.id', 'ASC')
        .getRawMany();
        console.log(sucursales);
        return sucursales;
    }
    async findSucursalBySie( id:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")
        .innerJoinAndSelect("d.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .where('d.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itt;
    }

    async findSucursalBySieGestion222( id:number, gestion:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")       
        .where('d.id = :id ', { id })
        .andWhere('a.gestionTipo = :gestion ', { gestion })
        .getOne();
        console.log(itt);
        return itt;
    }
    async findEspecialidadesBySie( id:number ){
        const especialidades = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "c")
        .innerJoinAndSelect("a.acreditacionEspecialidades", "b")
        .innerJoinAndSelect("b.especialidadTipo", "d")
        .innerJoinAndSelect("b.especialidadesNivelesAcademicos", "e")
        .innerJoinAndSelect("e.especialidadesNivelesIntervalos", "f")
        .innerJoinAndSelect("f.intervaloGestionTipo", "g")
        .innerJoinAndSelect("e.nivelAcademicoTipo", "h")
        .where('c.id = :id ', { id })
        .orderBy('d.id', 'ASC')
        .getMany();
        return especialidades;
    }
    async findEspecialidadesBySucursal( id:number ){
        const especialidades = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.acreditacionEspecialidades", "b")
        .innerJoinAndSelect("b.especialidadTipo", "d")
        .innerJoinAndSelect("b.especialidadesNivelesAcademicos", "e")
        .innerJoinAndSelect("e.especialidadesNivelesIntervalos", "f")
        .innerJoinAndSelect("f.intervaloGestionTipo", "g")
        .innerJoinAndSelect("e.nivelAcademicoTipo", "h")
        .where('a.id = :id ', { id })
        .orderBy('d.id', 'ASC')
        .getMany();
        return especialidades;
    }

    async createInstitucionEducativaSucursal(idUsuario,id:number,dto:CreateInstitucionEducativaDto, transaction) {
          
        const sucursal  = new InstitucionEducativaSucursal()
        sucursal.institucionEducativaId = id;
        sucursal.jurisdiccionGeograficaId = dto.jurisdiccion_geografica_id;
        sucursal.estadoInstitucionEducativaTipoId = 10;
        sucursal.usuarioId = idUsuario;
        sucursal.sucursalNombre = dto.sucursal_nombre;
        sucursal.sucursalCodigo = dto.sucursal_codigo;
        sucursal.vigente = true;
        sucursal.observacion = dto.observacion;         
        sucursal.gestionTipoId = 2023;//quitar luego         
      return await transaction.getRepository(InstitucionEducativaSucursal).save(sucursal)
  }

  async updateInstitucionEducativaSucursal(
    id:number,
    dto:CreateInstitucionEducativaDto,
    transaction: EntityManager) {
    await transaction.getRepository(InstitucionEducativaSucursal)
          .createQueryBuilder()
          .update(InstitucionEducativaSucursal)
          .set({
            jurisdiccionGeograficaId : dto.jurisdiccion_geografica_id,
            sucursalNombre : dto.sucursal_nombre,
            sucursalCodigo : dto.sucursal_codigo,
            observacion : dto.observacion
          })
          .where({ institucionEducativaId: id })
          .execute();
    
   }

   async getXlsAllIttSucursales(){
        const sucursales = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("b.educacionTipo", "d")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "e")
        .innerJoinAndSelect("c.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .innerJoinAndSelect("b.acreditados", "s")
        .innerJoinAndSelect("s.dependenciaTipo", "dt")
        .select([
            'a.id as "SUCURSAL"',
            'b.id as "RITT"',        
            'b.institucionEducativa as "INSTITUCION EDUCATIVA"',
            'up4.lugar as "DEPARTAMENTO"',
            'd.educacion as "TIPO INSTITUCION"',
            's.numeroResolucion as "NRO.RESOLUCION"',
            'dt.dependencia as "CARÁCTER JURÍDICO"',
            'a.sucursal_nombre as "SEDE/SUBSEDE"',      
        ])
        .where('d.id in (7,8,9,11,12,13)  ')
        .andWhere('e.id = 10 ')
        .andWhere('s.vigente = true ')
        .orderBy('a.id', 'ASC')
        .getRawMany();
        console.log(sucursales);
        return sucursales;
    }

    async getAllIttPlanesEstados(departamento_id, estado_id){
        const sucursales = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("c.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .innerJoinAndSelect("a.carreras", "ca")
        .innerJoinAndSelect("ca.carreraTipo", "ct")
        .innerJoinAndSelect("ca.institutosPlanesCarreras", "ipc")
        .innerJoinAndSelect("ipc.planEstudioCarrera", "pec")
        .innerJoinAndSelect("pec.estadoInstituto", "ei")
        .innerJoinAndSelect("pec.planEstudioResolucion", "per")
        //.innerJoinAndSelect("pec.planesSeguimientos", "ps")
        .select([
            'a.id as sucursal_id',
            'b.id as ie_id',
            'b.institucionEducativa as institucion_educativa',
            'up4.lugar as departamento',
            'c.id as id_jurisdiccion',
            'ca.id as id_carrera_autorizada',
            'ct.id as id_carrera_tipo',
            'ct.carrera as carrera',
            'ipc.id as id_insituto_plan_estudio_carrera',
            'pec.id as id_plan_estudio_carrera',
            'per.id as id_plan_estudio_carrera_resolucion',
            'per.numeroResolucion as numero_resolucion',
            'per.fechaResolucion as fecha_resolucion',
            'ei.estado as estado',
            'pec.fechaModificacion as fecha_estado',
          //  'ps.id as id_plan_seguimiento',
          ])
        .where('up4.id = :departamento_id ', { departamento_id })
        .andWhere('pec.estadoInstitutoId = :estado_id ', { estado_id })
        .orderBy('a.id', 'ASC')
        .getRawMany();
        console.log(sucursales);
        return sucursales;
    }
}
