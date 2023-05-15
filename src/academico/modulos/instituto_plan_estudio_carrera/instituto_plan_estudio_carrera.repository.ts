import { Injectable } from '@nestjs/common'
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPLanEstudioCarrera.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateInstitucionEducativaDto } from '../institucion_educativa/dto/createInstitucionEducativa.dto';


@Injectable()
export class InstitutoPlanEstudioCarreraRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        const itt = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).find();
        return itt;
    }

    async findResolucionesCarreraAutorizadaId( id:number){
        const itt = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera)
        .createQueryBuilder("ip")
        .innerJoinAndSelect("ip.planEstudioCarrera", "pe")       
        .innerJoinAndSelect("pe.planEstudioResolucion", "pr")       
        .leftJoinAndSelect("pe.planesAsignaturas", "pa")       
        .leftJoinAndSelect("pa.asignaturaTipo", "a")       
        .select([
            'ip.id',
            'ip.observacion',
            'pe.id',
            'pr.id',
            'pr.numeroResolucion',
            'pr.fechaResolucion',
            'pr.descripcion',
            'pr.activo',
            'pa.horas',
            'a.asignatura',
            'a.abreviacion',
        ])
        .where('ip.carreraAutorizadaId = :id ', { id })
        .getMany();
        return itt;
    }
   
/*
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
  }*/
}
