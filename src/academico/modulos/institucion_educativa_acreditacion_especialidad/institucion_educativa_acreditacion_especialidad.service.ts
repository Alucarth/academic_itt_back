import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativaAcreditacionEspecialidad } from 'src/academico/entidades/institucionEducativaAcreditacionEspecialidad.entity';
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
        .leftJoinAndSelect("a.institucionEducativaSucursal", "b")
        .leftJoinAndSelect("a.especialidadTipo", "c")
       // .select([ 'a.id', 'c.id', 'c.especialidad' ])
        .where('b.id = :id ', { id })
        .orderBy('a.id', 'ASC')
       // .getRawMany();
        .getMany();
        return especialidades;
    }
}
