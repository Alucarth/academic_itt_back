import { Inject, Injectable } from '@nestjs/common';
import { InstitutoPlanEstudioCarreraRepository } from './instituto_plan_estudio_carrera.repository';

@Injectable()
export class InstitutoPlanEstudioCarreraService {
    constructor(
        @Inject(InstitutoPlanEstudioCarreraRepository)
        private institutoPlanEstudioCarreraRepository: InstitutoPlanEstudioCarreraRepository
    ){}

    async getAll(){
        const sucursales = await this.institutoPlanEstudioCarreraRepository.getAll();
        return sucursales;

    }
    async getResolucionesCarreraAutorizadaId( id:number ){
        const sucursal = await this.institutoPlanEstudioCarreraRepository.findResolucionesCarreraAutorizadaId(id);
        return sucursal;

        
    }
}
