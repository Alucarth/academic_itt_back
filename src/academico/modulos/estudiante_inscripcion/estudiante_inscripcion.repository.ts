import { Injectable } from '@nestjs/common'
import { EstudianteInscripcion } from 'src/academico/entidades/estudianteInscripcion.entity';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateEstudianteInscripcionDto } from './dto/createEstudianteInscripcion.dto';
import { CreateEstudianteInscripcionOfertaDto } from './dto/createEstudianteInscripcionOferta.dto';

@Injectable()
export class EstudianteInscripcionRepository {
    
    constructor(
        private dataSource: DataSource
    ) {}

    async getAllEstudiantes(){
        return  await this.dataSource.getRepository(EstudianteInscripcion).find();
    }

    async getEstudianteInscripcionById(id:number){
       // return  await this.dataSource.getRepository(EstudianteInscripcion).findOneBy({ id:id });

        const inscripcion =  await this.dataSource.getRepository(EstudianteInscripcion)
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.persona", "b")
        .innerJoinAndSelect("a.institucionEducativaCurso", "c")
        .where('a.id = :id ', { id })
        .getOne();
        return inscripcion;
    }

    
    async getEstudianteInscripcionByCurso(idPersona:number, idCurso:number){

        const inscripcion =  await this.dataSource.getRepository(EstudianteInscripcion).findOneBy({
            personaId: idPersona,
            institucionEducativaCursoId:idCurso
        })

        return inscripcion;
    }
    
    async createInscripcion(
        dto: CreateEstudianteInscripcionDto
        ) {
            console.log("aaaaa");
        const inscripcion = new EstudianteInscripcion();
        inscripcion.personaId = dto.personaId;
        inscripcion.institucionEducativaCursoId = dto.institucionEducativaCursoId;
        inscripcion.estadoMatriculaInicioTipoId = 1;
        inscripcion.estadoMatriculaFinTipoId = 1;
        inscripcion.matriculaTipoId = 1;
        inscripcion.fechaInscripcion = new Date();

        return  await this.dataSource.getRepository(EstudianteInscripcion).save(inscripcion);

        
        
    }
    async createEstudianteInscripcionOferta(
        dto: CreateEstudianteInscripcionOfertaDto, 
        transaction: EntityManager
        ) {
            console.log(dto);
            const inscripcion = new EstudianteInscripcion();
            inscripcion.personaId = dto.personaId;
            inscripcion.institucionEducativaCursoId = dto.institucionEducativaCursoId;
            inscripcion.estadoMatriculaInicioTipoId = 1;
            inscripcion.estadoMatriculaFinTipoId = 1;
            inscripcion.matriculaTipoId = 1;
            inscripcion.fechaInscripcion = new Date();

        const result = await transaction.getRepository(EstudianteInscripcion).save(inscripcion);

        return result;
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }

}
