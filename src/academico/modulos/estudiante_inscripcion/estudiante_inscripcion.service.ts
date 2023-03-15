import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateEstudianteInscripcionDto } from './dto/createEstudianteInscripcion.dto';
import { EstudianteInscripcionRepository } from './estudiante_inscripcion.repository';

@Injectable()
export class EstudianteInscripcionService {
    constructor(
        @Inject(EstudianteInscripcionRepository)
        private estudianteInscripcionRepositorio: EstudianteInscripcionRepository,
    ){}
    async findEstudiantes(){
        return await this.estudianteInscripcionRepositorio.getAll();
    }

    async createEstudianteInscripcion (dto: CreateEstudianteInscripcionDto) {

        return await this.estudianteInscripcionRepositorio.createInscripcion(dto);
        
 
    }
}
