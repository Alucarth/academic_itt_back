import { Injectable } from '@nestjs/common'
import { AsignaturaTipo } from 'src/academico/entidades/asignaturaTipo.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class OfertaAcademicaRepository {
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(OfertaAcademica).find();
    }

    async findAsignaturasByCursoId( id:number ){
        const asignaturas = await this.dataSource.getRepository(OfertaAcademica)
        .createQueryBuilder("a")
        .where('a.institucionEducativaCurso = :id ', { id })
        .getMany();
        return asignaturas;
    }

    async crearOfertaAcademica(idUsuario, idCurso, asignaturas, transaction) {

        const ofertas: OfertaAcademica[] = asignaturas.map((item) => {
          const curso = new InstitucionEducativaCurso();
          curso.id = idCurso;

          const asignatura = new AsignaturaTipo();
          asignatura.id = item.asignaturaTipo.id;
          
          const ofertaAcademica  = new OfertaAcademica()
          ofertaAcademica.asignaturaTipo = asignatura;
          ofertaAcademica.institucionEducativaCurso = curso;
          ofertaAcademica.usuarioId = idUsuario;
          ofertaAcademica.opcional = true;
    
          return ofertaAcademica;
        });
    
        return await transaction.getRepository(OfertaAcademica).save(ofertas)
    }
    /*
    async delete(id: string) {
        return await this.dataSource.getRepository(OfertaAcademica).delete(id)
      }
    async deleteOfertaAcademicaByCurso(asignaturas) {

        const ofertas: OfertaAcademica[] = asignaturas.map((item) => {
            this.delete(item.id);          
        });
    
        return await transaction.getRepository(OfertaAcademica).save(ofertas)
    }
  */
}
