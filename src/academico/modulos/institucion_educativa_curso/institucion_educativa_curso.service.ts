import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';

import { Repository } from 'typeorm';
import { CreateInstitucionEducativaCursoDto } from './dto/createInstitucionEducativaCurso.dto';

@Injectable()
export class InstitucionEducativaCursoService {
    constructor(
        @InjectRepository(InstitucionEducativaCurso) private institucionEducativaCursoRepository: Repository<InstitucionEducativaCurso>,
    ){}
    async getAll(){
        const cursos = await this.institucionEducativaCursoRepository.find()
        return cursos
    }

    async createCursos (dto: CreateInstitucionEducativaCursoDto) {
             
        const curso = new InstitucionEducativaCurso();
        curso.gestionTipoId = dto.gestionTipoId;
        curso.turnoTipoId = dto.turnoTipoId;
        curso.etapaEducativaId = dto.etapaEducativaId;
        curso.paraleloTipoId = dto.paraleloTipoId;
        curso.institucionEducativaSucursalId = dto.institucionEducativaSucursalId;
        curso.periodoTipoId = dto.periodoTipoId;
        curso.usuarioId = dto.usuarioId;
        const result = await this.institucionEducativaCursoRepository.save(curso);
        
        return result;
    }

    async createCurso (dto: CreateInstitucionEducativaCursoDto) {

        const curso = new InstitucionEducativaCurso();
            curso.gestionTipoId = dto.gestionTipoId;
            curso.turnoTipoId = dto.turnoTipoId;
            curso.etapaEducativaId = dto.etapaEducativaId;
            curso.paraleloTipoId = dto.paraleloTipoId;
            curso.institucionEducativaSucursalId = dto.institucionEducativaSucursalId;
            curso.periodoTipoId = dto.periodoTipoId;
            curso.usuarioId = dto.usuarioId;
            const result = await this.institucionEducativaCursoRepository.save(curso);
            
            return result;
    }
}
