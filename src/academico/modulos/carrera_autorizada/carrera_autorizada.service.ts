import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarreraAutorizadaService {
    constructor(
        @InjectRepository(CarreraAutorizada)
        private carreraAutorizadaRepositorio: Repository<CarreraAutorizada>,
      
        //private _serviceResp: RespuestaSigedService
      ) {}
      async getById(id: number) {
        const carrera = await this.carreraAutorizadaRepositorio.findOneBy({ id: id });
        return carrera;
      }
      async getCarrerasBySie(id: number) {
        console.log("aaaaa"+id);
        const carreras = await this.carreraAutorizadaRepositorio
      .createQueryBuilder("ca")
      .innerJoinAndSelect("ca.institucionEducativaSucursal", "s")
      .innerJoinAndSelect("ca.carreraTipo", "ct")
      .innerJoinAndSelect("ca.areaTipo", "at")
      .innerJoinAndSelect("ca.resoluciones", "r")
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
        'ct.id as carrera_id',
        'na.nivel_academico as nivel_academico',
        'ig.intervalo_gestion as intervalo_gestion',       
    ])
      .where("i.id = :id ", { id })
      .getRawMany();
    
    return carreras;
}
}
