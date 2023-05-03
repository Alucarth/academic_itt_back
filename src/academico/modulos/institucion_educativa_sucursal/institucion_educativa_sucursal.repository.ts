import { Injectable } from '@nestjs/common'
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateInstitucionEducativaDto } from '../institucion_educativa/dto/createInstitucionEducativa.dto';


@Injectable()
export class InstitucionEducativaSucursalRepository {
    
    constructor(private dataSource: DataSource) {}

    async findSucursalBySieGestion( sie:number, gestion:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")       
        .where('d.id = :sie ', { sie })
        .andWhere('a.gestionTipo = :gestion ', { gestion })
        .getOne();
        return itt;
    }
    async findSucursalBySieVigente( sie:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")       
        .where('d.id = :sie ', { sie })
        .andWhere('a.vigente = true ')
        .getOne();
        return itt;
    }
   
    async getAllIttSucursales(){
        const sucursales = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .innerJoinAndSelect("b.educacionTipo", "d")
        .innerJoinAndSelect("a.estadoInstitucionEducativaTipo", "e")
        .innerJoinAndSelect("c.localidadUnidadTerritorial2001", "u1")
        .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
        .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
        .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
        .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
        .innerJoinAndSelect("b.acreditados", "s")
        .innerJoinAndSelect("s.dependenciaTipo", "dt")
       // .select('b.id', 'b.institucionEducativa')
        .where('d.id in (7,8,9)  ')
        .andWhere('e.id = 10 ')
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log(sucursales);
        return sucursales;
    }
    async findSucursalBySie( id:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")
        .innerJoinAndSelect("d.educacionTipo", "b")
        .innerJoinAndSelect("a.jurisdiccionGeografica", "c")
        .where('d.id = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        return itt;
    }

    async findSucursalBySieGestion222( id:number, gestion:number ){
        const itt = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.institucionEducativa", "d")       
        .where('d.id = :id ', { id })
        .andWhere('a.gestionTipo = :gestion ', { gestion })
        .getOne();
        console.log(itt);
        return itt;
    }
    async findEspecialidadesBySie( id:number ){
        const especialidades = await this.dataSource.getRepository(InstitucionEducativaSucursal)
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
    async findEspecialidadesBySucursal( id:number ){
        const especialidades = await this.dataSource.getRepository(InstitucionEducativaSucursal)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.acreditacionEspecialidades", "b")
        .innerJoinAndSelect("b.especialidadTipo", "d")
        .innerJoinAndSelect("b.especialidadesNivelesAcademicos", "e")
        .innerJoinAndSelect("e.especialidadesNivelesIntervalos", "f")
        .innerJoinAndSelect("f.intervaloGestionTipo", "g")
        .innerJoinAndSelect("e.nivelAcademicoTipo", "h")
        .where('a.id = :id ', { id })
        .orderBy('d.id', 'ASC')
        .getMany();
        return especialidades;
    }

    async createInstitucionEducativaSucursal(idUsuario,id:number,dto:CreateInstitucionEducativaDto, transaction) {
          
        const sucursal  = new InstitucionEducativaSucursal()
        sucursal.institucionEducativaId = id;
        sucursal.jurisdiccionGeograficaId = dto.jurisdiccionGeograficaId;
        sucursal.estadoInstitucionEducativaTipoId = 10;
        sucursal.usuarioId = idUsuario;
        sucursal.sucursalNombre = dto.sucursalNombre;
        sucursal.sucursalCodigo = dto.sucursalCodigo;
        sucursal.vigente = true;
        sucursal.observacion = '';         
      return await transaction.getRepository(InstitucionEducativaSucursal).save(sucursal)
  }
}
