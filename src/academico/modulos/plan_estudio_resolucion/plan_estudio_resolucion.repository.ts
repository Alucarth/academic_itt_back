import { Injectable } from '@nestjs/common'
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateCarreraAutorizadaResolucionDto } from '../carrera_autorizada_resolucion/dto/createCarreraAutorizadaResolucion.dto';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';
import { CreateResolucionDto } from './dto/createResolucion.dto';

@Injectable()
export class PlanEstudioResolucionRepository {
    createQueryBuilder() {
        throw new Error('Method not implemented.');
    }
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(PlanEstudioResolucion).find();
        
    }
    async getByDato(dto:CreateResolucionDto){
        return  await this.dataSource.getRepository(PlanEstudioResolucion).findOneBy({'numeroResolucion':dto.numero_resolucion});
        
    }
    async findResolucionesAll(){
      //  return  await this.dataSource.getRepository(PlanEstudioResolucion).find();
        return  await this.dataSource.getRepository(PlanEstudioResolucion)
        .createQueryBuilder("r")
        .innerJoinAndSelect("r.planesCarreras", "p")
        .innerJoinAndSelect("p.carreraTipo", "t")
        .innerJoinAndSelect("p.nivelAcademicoTipo", "n")
        .innerJoinAndSelect("p.areaTipo", "a")
        .innerJoinAndSelect("p.intervaloGestionTipo", "i")
        .innerJoinAndSelect("p.planesAsignaturas", "pa")
        .innerJoinAndSelect("pa.regimenGradoTipo", "rg")
        .innerJoinAndSelect("pa.asignaturaTipo", "at")
        //.leftJoinAndSelect("a.planesAsignaturasReglas", "pr")
        .select([
            'r.id',
            'r.numeroResolucion',
            'r.fechaResolucion',
            'p.id',
            'a.area',
            't.carrera',
            'n.nivelAcademico',
            'i.intervaloGestion',
            'i.intervaloGestion',
            'pa.id',
            'pa.horas',
            'at.asignatura',
            'at.abreviacion',
            'rg.regimenGrado',
           // 'pr.id',
        ])
        .getMany()

    }
    async findResoluciones(){
        //  return  await this.dataSource.getRepository(PlanEstudioResolucion).find();
          return  await this.dataSource.getRepository(PlanEstudioResolucion)
          .createQueryBuilder("r")
          
          .select([
              'r.id',
              'r.numeroResolucion',
              'r.fechaResolucion',
            
          ])
          .getMany()
  
      }
    async crearPlanEstudioResolucion(
        dto: CreatePlanEstudioResolucionDto,
        transaction: EntityManager,
        ) {
            const per = new PlanEstudioResolucion();
            per.numeroResolucion = dto.numero_resolucion;
            per.fechaResolucion = dto.fecha_resolucion;
            per.descripcion = dto.descripcion;
            per.activo = true;
            per.usuarioId = 1;
            const result = await transaction.getRepository(PlanEstudioResolucion).save(per);
       
        return result;
    }
    async crearNuevaResolucion(
        idUsuario,
        dto: CreateResolucionDto,
        transaction: EntityManager,
        ) {
            const resolucion = new PlanEstudioResolucion();
            resolucion.numeroResolucion = dto.numero_resolucion;
            resolucion.fechaResolucion = dto.fecha_resolucion;
            resolucion.descripcion = dto.descripcion;
            resolucion.activo = true;
            resolucion.usuarioId = 1;
            const result = await transaction.getRepository(PlanEstudioResolucion).save(resolucion);
       
        return result;
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
