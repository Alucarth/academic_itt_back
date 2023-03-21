import { Injectable } from '@nestjs/common'
import { AsignaturaTipo } from 'src/academico/entidades/asignaturaTipo.entity';
import { EstudianteInscripcion } from 'src/academico/entidades/estudianteInscripcion.entity';
import { EstudianteInscripcionOfertaAcademica } from 'src/academico/entidades/estudianteInscripcionOfertaAcademica.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class EstudianteInscripcionOfertaAcademicaRepository {
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(EstudianteInscripcionOfertaAcademica).find();
    }
   
    async getInscripcionAsignaturas(id:number){
        // return  await this.dataSource.getRepository(EstudianteInscripcion).findOneBy({ id:id });
 
         const cursos =  await this.dataSource.getRepository(EstudianteInscripcionOfertaAcademica)
         .createQueryBuilder("a")
         .innerJoinAndSelect("a.ofertaAcademica", "b")
         .where('a.estudianteInscripcion.id = :id ', { id })
         .getMany();
         return cursos;
    }

    async createEstudianteInscripcionOfertaAcademica(
        idUsuario,
        idEstudianteInscripcion,
        ofertas,
        transaction) {
        console.log(idEstudianteInscripcion);
        
        const inscripcionOfertas: EstudianteInscripcionOfertaAcademica[] = ofertas.map((item) => {
          
          const ofertaAcademica = new OfertaAcademica();
          ofertaAcademica.id = item.id;

          const estudianteInscripcion = new EstudianteInscripcion();
          estudianteInscripcion.id = idEstudianteInscripcion;
          
          const estudianteInscripcionOfertaAcademica  = new EstudianteInscripcionOfertaAcademica();
          estudianteInscripcionOfertaAcademica.ofertaAcademica = ofertaAcademica;
          estudianteInscripcionOfertaAcademica.estudianteInscripcion = estudianteInscripcion;

          return estudianteInscripcionOfertaAcademica;
        });
    
        return await transaction.getRepository(EstudianteInscripcionOfertaAcademica).save(inscripcionOfertas);
    }

    async createInscripcionOfertaAcademica(
        idEstudianteInscripcion,
        ofertas) {
        
        const inscripcionOfertas: EstudianteInscripcionOfertaAcademica[] = ofertas.map((item) => {
          
          const ofertaAcademica = new OfertaAcademica();
          ofertaAcademica.id = item.id;

          const estudianteInscripcion = new EstudianteInscripcion();
          estudianteInscripcion.id = idEstudianteInscripcion;
          
          const estudianteInscripcionOfertaAcademica  = new EstudianteInscripcionOfertaAcademica();
          estudianteInscripcionOfertaAcademica.ofertaAcademica = ofertaAcademica;
          estudianteInscripcionOfertaAcademica.estudianteInscripcion = estudianteInscripcion;
       
          return estudianteInscripcionOfertaAcademica;
        });
       
    
       return await this.dataSource
       .createQueryBuilder()
       .insert()
       .into(EstudianteInscripcionOfertaAcademica)
       .values(inscripcionOfertas)
       .execute()

       
    }
    
}
