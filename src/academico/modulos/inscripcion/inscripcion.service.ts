import { Inject, Injectable } from "@nestjs/common";
import { RespuestaSigedService } from "src/shared/respuesta.service";
import { CreatePersonaoDto } from "../persona/dto/createPersona.dto";
import { CreateInscriptionDto } from "./dto/createInscription.dto";
import { PersonaService } from "../persona/persona.service";


@Injectable()
export class InscripcionService {


    constructor(        
    private _serviceResp: RespuestaSigedService,
    private _servicePersona: PersonaService
  ) {}

  async createInscription(dto: CreateInscriptionDto) {

    //1: existe la persona ?

    const persona = await this._servicePersona.findPersona(dto.personaId)
    console.log('persona: ', persona);
    

  }

  
}
