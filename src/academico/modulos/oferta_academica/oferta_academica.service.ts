import { Inject, Injectable } from '@nestjs/common';
import { OfertaAcademicaRepository } from './oferta_academica.repository';

@Injectable()
export class OfertaAcademicaService {
    constructor(
        @Inject(OfertaAcademicaRepository)
        private ofertaAcademicaRepositorio: OfertaAcademicaRepository,
    ){}
    
    async findAsignaturasByCursoId(id:number){
        return await this.ofertaAcademicaRepositorio.findAsignaturasByCursoId(id);
    }

}
