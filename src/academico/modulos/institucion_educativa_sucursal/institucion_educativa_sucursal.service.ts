import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitucionEducativaSucursalService {
    constructor(
        @InjectRepository(InstitucionEducativaSucursal)
        private institucionEducativaSucursalRepository: Repository<InstitucionEducativaSucursal>
    ){}
    async getAllIttSucursales(){
        const sucursales = await this.institucionEducativaSucursalRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("b.educacionTipo", "d")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "e")
       // .select('b.id', 'b.institucionEducativa')
        .where('d.id in (7,8,9)  ')
        .andWhere('e.id = 10  ')
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log(sucursales);
        return sucursales;
    }

    async findSucursalBySie( id:number ){
        const itt = await this.institucionEducativaSucursalRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")
        .innerJoinAndSelect("d.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .where('d.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itt;
    }
    async findEspecialidadesBySie( id:number ){
        const especialidades = await this.institucionEducativaSucursalRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "c")
        .innerJoinAndSelect("a.acreditacionEspecialidades", "b")
        .innerJoinAndSelect("b.especialidadTipo", "d")
        .innerJoinAndSelect("b.especialidadesNivelesAcademicos", "e")
        .innerJoinAndSelect("e.especialidadesNivelesIntervalos", "f")
        .innerJoinAndSelect("f.intervaloGestionTipo", "g")
        .innerJoinAndSelect("e.nivelAcademicoTipo", "h")
        .where('c.id = :id ', { id })
        .orderBy('d.id', 'ASC')
        .getMany();
        return especialidades;
    }
    
}
