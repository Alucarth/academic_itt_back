import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArchivoTipo } from "src/academico/entidades/archivoTipo.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class ArchivoTipoService {
    constructor(
        @InjectRepository(ArchivoTipo)
        private archivoTipoRepository: Repository<ArchivoTipo>
    ){}
    
    async getAll()
    {
        return await this.archivoTipoRepository.find()
    }

    async getTypeTransitability()
    {
        return await this.archivoTipoRepository.find({
            where: {id: In([2,3]) }
        })
    }

    async getTypeHomologation()
    {
        return await this.archivoTipoRepository.findOneBy({id: 1})
    }
}