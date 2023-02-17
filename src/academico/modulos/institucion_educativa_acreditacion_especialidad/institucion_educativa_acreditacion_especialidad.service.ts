import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativaAcreditacionEspecialidad } from 'src/academico/entidades/institucion_educativa_acreditacion_especialidad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitucionEducativaAcreditacionEspecialidadService {
    constructor(
        @InjectRepository(InstitucionEducativaAcreditacionEspecialidad)
        private institucionEducativaAcreditacionEspecialidadRepository : Repository<InstitucionEducativaAcreditacionEspecialidad>
    ){}
    async findEspecialidadesBySie( id:number ){
        const especialidades = await this.institucionEducativaAcreditacionEspecialidadRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "b")
        .innerJoinAndSelect("a.especialidadTipo", "c")
        .where('b.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return especialidades;
    }
}
