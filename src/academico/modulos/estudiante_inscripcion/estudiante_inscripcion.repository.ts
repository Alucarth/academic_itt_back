import { Injectable } from '@nestjs/common'
import { EstudianteInscripcion } from 'src/academico/entidades/estudianteInscripcion.entity';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { DataSource } from 'typeorm'
import { CreateEstudianteInscripcionDto } from './dto/createEstudianteInscripcion.dto';

@Injectable()
export class EstudianteInscripcionRepository {
    
    constructor(
        private dataSource: DataSource
    ) {}

    async getAll(){
        return  await this.dataSource.getRepository(EstudianteInscripcion).find();
    }
    async createInscripcion(
        dto: CreateEstudianteInscripcionDto
        ) {
        const inscripcion = new EstudianteInscripcion();
        inscripcion.personaId = dto.personaId;
        inscripcion.institucionEducativaCursoId = dto.institucionEducativaCursoId;
        inscripcion.estadoMatriculaInicioTipo.id = 1;
        inscripcion.estadoMatriculaFinTipo.id = 1;
        inscripcion.matriculaTipo.id = 1;
        inscripcion.fechaInscripcion = new Date();

        return  await this.dataSource.getRepository(EstudianteInscripcion).save(inscripcion);
        
    }

}
