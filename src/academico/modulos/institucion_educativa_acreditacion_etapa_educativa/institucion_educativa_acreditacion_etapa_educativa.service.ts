import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativaAcreditacionEtapaEducativa } from 'src/academico/entidades/institucionEducativaAcreditacionEtapaEducativa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitucionEducativaAcreditacionEtapaEducativaService {
    constructor(
        @InjectRepository(InstitucionEducativaAcreditacionEtapaEducativa)
        private institucionEducativaAcreditacionEtapaEducativaRepository: Repository<InstitucionEducativaAcreditacionEtapaEducativa>,
        
      ) {}
      async getAll() {
        const etapa = await this.institucionEducativaAcreditacionEtapaEducativaRepository.find();
        return etapa;
      }

      async getCarrerasBySie(id: number) {
        console.log("aaaaa"+id);
        const carreras = await this.institucionEducativaAcreditacionEtapaEducativaRepository
      .createQueryBuilder("ae")
      .innerJoinAndSelect("ae.institucionEducativaAcreditacion", "ac")
      .innerJoinAndSelect("ac.institucionEducativa", "i")
      .innerJoinAndSelect("ae.etapaEducativa", "a")
      .innerJoinAndSelect("a.etapaEducativaTipo", "e1")
      .innerJoinAndSelect("a.etapaEducativaPadre", "p1")
      .innerJoinAndSelect("p1.etapaEducativaTipo", "e2")
      .innerJoinAndSelect("p1.etapaEducativaPadre", "p2")
      .innerJoinAndSelect("p2.etapaEducativaTipo", "e3")
      .innerJoinAndSelect("p2.etapaEducativaPadre", "p3")
      .innerJoinAndSelect("p3.etapaEducativaTipo", "e4")
      .select([
        'i.id as ie_id',
        'ae.numero_resolucion as numero_resolucion',
        'ae.fecha_resolucion as fecha_resolucion',
        'ae.tiempo as tiempo',
        'ae.carga_horaria as carga_horaria',
        'ac.observacion as observacion',
        'a.id as carrera_id',
        'a.etapaEducativa as carrera',
        'e1.id as tipo_carrera_id',
        'e1.etapaEducativa as tipo_carrera',
        'p1.id as area_id',
        'p1.etapaEducativa as area',
        'e2.id as tipo_area_id',
        'e2.etapaEducativa as tipo_area',
        'p2.id as regimen_id',
        'p2.etapaEducativa as regimen',
        'e3.id as tipo_regimen_id',
        'e3.etapaEducativa as tipo_regimen',
        'p3.id as nivel_id',
        'p3.etapaEducativa as nivel',
        'e4.id as tipo_nivel_id',
        'e4.etapaEducativa as tipo_nivel',
    ])
      .where("i.id = :id ", { id })
      .getRawMany();
    
    return carreras;
}
}
