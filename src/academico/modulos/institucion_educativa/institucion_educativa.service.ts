import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { EntityManager, Repository } from 'typeorm';


@Injectable()
export class InstitucionEducativaService {
    constructor(
        @InjectRepository(InstitucionEducativa) private institucioneducativaRepository: Repository<InstitucionEducativa>,
        @InjectEntityManager() private entityManager: EntityManager,
        
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

        const tabla = 'tmp_prueba_'+id;
        const sql1 =
        'select sp_genera_tabla_plana (\n' +
        '    "etapa_educativa_tipo", \n' +
        '        "25",\n' +
        '        "28",\n' +
        '        "tmp_prueba_80730841",\n' +
        '        "etapa_educativa",\n' +
        '        "codigo",\n' +
        '        "etapa_educativa",\n' +
        '        "etapa_educativa_tipo_id"\n' +
        '   );';
      
     // const funcion = await this.entityManager.query(sql1);
     //console.log(funcion);
      const sql =
        'select * from tmp_prueba_80730841';
      //'select * from abandono_tipo';
        const data = await this.entityManager.query(sql);

      console.log(data);
      return data;

    }
 
}
