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
   
  async crearCarreraResolucion(
    usuario,
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
    
    //curso.usuarioId = 1;// dto.usuarioId;

    const result = await transaction.getRepository(CarreraAutorizadaResolucion).save(car);
   
    return result;
}
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
