import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EtapaEducativaAsignaturaService {
    constructor(
        @InjectRepository(EtapaEducativaAsignatura)
        private etapaEducativaAsignaturaRepository : Repository<EtapaEducativaAsignatura>
    ){}

    async getAll(){
        return await this.etapaEducativaAsignaturaRepository.find();
    }
    async findAsignaturasByEspecialidad( id:number ){
        const asignaturas = await this.etapaEducativaAsignaturaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.asignaturaTipo", "c")
        //.innerJoinAndSelect("a.intervaloTiempoTipo", "d")
        .innerJoinAndSelect("a.etapaEducativa", "e")
        .where('a.especialidadTipo = :id ', { id })
        .orderBy('c.id', 'ASC')
        .getMany();
        return asignaturas;
    }
    async findAsignaturasByEspecialidadEtapa( id:number, etapa:number ){
        const asignaturas = await this.etapaEducativaAsignaturaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.asignaturaTipo", "c")
        .where('a.especialidadTipo = :id ', { id })
        .where('a.etapaEducativa = :etapa ', { etapa })
        .orderBy('c.id', 'ASC')
        .getMany();
        return asignaturas;
    }
    async findAsignaturasByEspecialidadEtapaPlan( id:number, etapa:number ,  plan:number ){
        const asignaturas = await this.etapaEducativaAsignaturaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.asignaturaTipo", "c")
        .where('a.especialidadTipo = :id ', { id })
        .where('a.etapaEducativa = :etapa ', { etapa })
        .where('a.planEstudio = :plan ', { plan })
        .orderBy('c.id', 'ASC')
        .getMany();
        return asignaturas;
    }
}
