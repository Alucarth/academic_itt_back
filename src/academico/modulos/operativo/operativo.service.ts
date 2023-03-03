import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operativo } from 'src/academico/entidades/operativo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OperativoService {

    constructor(
        @InjectRepository(Operativo) private operativoRepository: Repository<Operativo>,
    ){}
    async findAll(){
        return await this.operativoRepository.find()
    }

    async findGestionesSucursal(id:number){

        const itts = await this.operativoRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativaSucursal", "b")
        .innerJoinAndSelect("a.periodoTipo", "c")
        .innerJoinAndSelect("a.gestionTipo", "d")
        .where('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log(itts);
        return itts;

        

    }
    
    async findGestionVigente(sie:number){
        const gestion = await this.operativoRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativaSucursal", "b")
        .innerJoinAndSelect("a.institucionEducativa", "c")
        .innerJoinAndSelect("a.periodoTipo", "c")
        .innerJoinAndSelect("a.gestionTipo", "d")
        .where('c.id = :id ', { sie })
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log(gestion);
        return gestion;

    }
}
