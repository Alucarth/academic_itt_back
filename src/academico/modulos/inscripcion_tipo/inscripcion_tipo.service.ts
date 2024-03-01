import { InjectRepository } from "@nestjs/typeorm";
import { InscripcionTipo } from "src/academico/entidades/inscripcionTipo.entity";
import { In, Repository } from "typeorm";

export class InscripcionTipoService{
 constructor(
    @InjectRepository(InscripcionTipo)
    private incripcionTipoRepository: Repository <InscripcionTipo>
    ){}   

    async findHomologationReincorporation()
    {
        return this.incripcionTipoRepository.find({
            where: { id: In([3,4]) }
        })
    }
}