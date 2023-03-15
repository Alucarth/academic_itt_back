import { Injectable } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { Repository } from 'typeorm';


@Injectable()
export class InstitucionEducativaService {
    constructor(
        @InjectRepository(InstitucionEducativa) private institucioneducativaRepository: Repository<InstitucionEducativa>,
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
   
    async getById(id:number){
        const itt = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .where('a.id = :id ', { id })
        .getOneOrFail();
        console.log(itt);
        return itt;
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
    async findOneAcreditadoBySie( id:number ){
        console.log(id);
        const itt = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "c")
        .innerJoinAndSelect("a.acreditados", "e")
        .innerJoinAndSelect("e.convenioTipo", "f")
        .innerJoinAndSelect("e.dependenciaTipo", "g")
        .innerJoinAndSelect("e.acreditacionTipo", "i")
       // .select('a.id as id, a.institucion_educativa')
        .where('b.id in (7,8,9)  ')
        .andWhere('a.id = :id ', { id })
        .andWhere('e.vigente = :vigente ', { vigente: 'TRUE'})
        .orderBy('a.id', 'ASC')
        //.getOneOrFail();
        .getRawOne();
        return itt;
    }
    async findEspecialidadBySie( id:number ){
        const itts = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .where('b.id in (7,8,9)  ')
        .where('a.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itts;
    }
    async findEtapasBySie( id:number ){
        const carreras = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.acreditados", "b")
        .innerJoinAndSelect("b.acreditadosEtapasEducativas", "c")
        .innerJoinAndSelect("c.etapaEducativa", "d")
        .where('a.id = :id ', { id })
        .andWhere('d.etapaEducativaTipo = 28 ') //PARA SOLO MOSTRAR LA CARRER
        .orderBy('a.id', 'ASC')
        .getMany();
        return carreras;
    }

    async findCarrerasBySie( id:number ){
        const values = ['etapa_educativa_tipo',25,28,id,'etapa_educativa','codigo','etapa_educativa','etapa_educativa_tipo_id'];
        const sql = 'select * from sp_genera_acreditacion_oferta_json($1,$2,$3,$4,$5,$6,$7,$8)';
        const data = await this.institucioneducativaRepository.query(sql, values);
        console.log(data);
        return data;
    }
    async findSucursalGestion( sie:number, gestion:number ){
        console.log("consulta");
        console.log(sie);
        console.log(gestion);
        const sucursal = await this.institucioneducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.sucursales", "b")
        .innerJoinAndSelect("b.gestionTipo", "g")
        .select(['a.id as id','a.institucionEducativa as institucion_educativa', 'b.id as sucursal_id'])
        .where('a.id = :id ', { id: sie })
        .andWhere('g.id = :gestion ', { gestion : gestion }) //PARA SOLO MOSTRAR LA CARRER
        .getRawOne();
        return sucursal;
    }
}
