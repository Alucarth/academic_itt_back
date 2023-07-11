import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { Repository } from 'typeorm';
import { InstitucionEducativaSucursalRepository } from './institucion_educativa_sucursal.repository';


//para exportar a xls
import { Workbook } from "exceljs";
import * as tmp from "tmp";
import { writeFile } from "fs/promises";

@Injectable()
export class InstitucionEducativaSucursalService {
    constructor(
        @Inject(InstitucionEducativaSucursalRepository)
        private institucionEducativaSucursalRepository: InstitucionEducativaSucursalRepository
    ){}

    async getAllIttSucursales(){
        const sucursales = await this.institucionEducativaSucursalRepository.getAllIttSucursales();
        return sucursales;

    }

    
    async findSucursalBySie( id:number ){
        const sucursal = await this.institucionEducativaSucursalRepository.findSucursalBySie(id);
        return sucursal;

        
    }
    async findSucursalBySieGestion( id:number, gestion:number ){
        const sucursal = await this.institucionEducativaSucursalRepository.findSucursalBySieGestion(id, gestion);
        return sucursal;

        
    }
    async findEspecialidadesBySie( id:number ){
        const sucursal = await this.institucionEducativaSucursalRepository.findEspecialidadesBySie(id);
        return sucursal;
    }
    async findEspecialidadesBySucursal( id:number ){
        const sucursal = await this.institucionEducativaSucursalRepository.findEspecialidadesBySucursal(id);
        return sucursal;

      
    }

    async getXlsIttSucursales(){
        const data = await this.institucionEducativaSucursalRepository.getAllIttSucursales();
        
        console.log("result xls: ", data);

   

    }
    
}
