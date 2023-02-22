import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitucionEducativaService {
    constructor(
        @InjectRepository(InstitucionEducativa)
        private institucioneducativaRepository: Repository<InstitucionEducativa>
    ){}

    async getAll(){
        return await this.institucioneducativaRepository.find()
    }

    async getAllItt(){
        const itts = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .where('b.id in (7,8,9)  ')
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log(itts);
        return itts;
    }

    async findBySie( id:number ){
        const itts = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("a.sucursales", "d")
        .where('b.id in (7,8,9)  ')
        .where('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itts;
    }
    async findEspecialidadBySie( id:number ){
        const itts = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .where('b.id in (7,8,9)  ')
        .where('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itts;
    }
}
