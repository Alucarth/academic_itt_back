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
        //.innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("a.sucursales", "d")
        .leftJoinAndSelect("a.acreditados", "e")
        .leftJoinAndSelect("e.convenioTipo", "f")
        .leftJoinAndSelect("e.dependenciaTipo", "g")
        .leftJoinAndSelect("e.acreditacionTipo", "h")
        .select(["a","c","d","e","f","g","h"])
        .where('a.educacionTipo in (7,8,9)  ')
        .where('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itts;
    }
    async findAcreditacionBySie( id:number ){
        const itts = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("a.sucursales", "d")
        .innerJoinAndSelect("a.acreditados", "e")
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
